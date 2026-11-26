<?php
/**
 * Mwamunda API.
 *
 * Access rules, in one place:
 *   - Public, no login:  POST contacts, POST applications (fixed column list,
 *                        validated), GET active careers, GET active products,
 *                        and the login / logout / session actions.
 *   - Everything else:   a logged-in user whose role is "admin".
 *
 * Tables and columns are never taken from the request: every table has an
 * entry in api_schema() and a request can only touch what is listed there.
 *
 * Requires PHP 7.4+ with mysqli (mysqlnd).
 */

ini_set('display_errors', '0');

const SESSION_COOKIE = 'mwamunda_admin';
const SESSION_IDLE_SECONDS = 1800;      // logged out after 30 minutes idle
const SESSION_MAX_SECONDS = 28800;      // and after 8 hours regardless
const LOGIN_WINDOW_MINUTES = 15;
// Login attempts allowed per window before further ones are refused.
const LOGIN_MAX_PER_PAIR = 10;          // one email from one address: the working limit
const LOGIN_MAX_PER_EMAIL = 200;        // one email from every address together
const LOGIN_MAX_PER_IP = 300;           // one address across every email
const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_BYTES = 72;          // bcrypt ignores everything after 72 bytes
const DEFAULT_ALLOWED_ORIGINS = 'https://mwamunda.co.ke,https://www.mwamunda.co.ke';
const READ_ONLY_COLUMNS = ['id', 'created_at', 'updated_at'];

/* ============================================================
   Helpers
   ============================================================ */

/** Reads a setting from the environment (getenv, SetEnv, or FastCGI params). */
function env_value($key, $default = null)
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        $value = $_SERVER[$key] ?? ($_SERVER['REDIRECT_' . $key] ?? ($_ENV[$key] ?? null));
    }
    return ($value === null || $value === false || $value === '') ? $default : (string) $value;
}

function is_development()
{
    return env_value('APP_ENV', 'production') === 'development';
}

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function fail($status, $message)
{
    respond($status, ['error' => $message]);
}

function text_length($value)
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

/**
 * The caller's address for rate limiting: REMOTE_ADDR, unless the operator has
 * named the header their own proxy or CDN sets (TRUSTED_PROXY_IP_HEADER).
 * No forwarded header is trusted by default, because any client can send one.
 */
function client_ip()
{
    $header = env_value('TRUSTED_PROXY_IP_HEADER');

    if ($header !== null) {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', trim($header)));
        $value = $_SERVER[$key] ?? null;
        if (preg_match('/^HTTP_[A-Z0-9_]+$/', $key) && is_string($value)) {
            // In a list (X-Forwarded-For) the last entry is the one the proxy
            // added; anything before it is only what the client claimed.
            $entries = explode(',', $value);
            $candidate = trim((string) end($entries));
            if (filter_var($candidate, FILTER_VALIDATE_IP) !== false) {
                return $candidate;
            }
        }
    }

    $remote = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return filter_var($remote, FILTER_VALIDATE_IP) !== false ? $remote : 'unknown';
}

function request_is_https()
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    return strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
}

/**
 * An Origin is accepted when it is on the allow-list, or when it is the very
 * host this request was sent to (a same-origin request from the site itself).
 */
function origin_allowed($origin)
{
    $allowed = array_filter(array_map('trim', explode(',', env_value('ALLOWED_ORIGINS', DEFAULT_ALLOWED_ORIGINS))));
    if (in_array(rtrim($origin, '/'), $allowed, true)) {
        return true;
    }

    $parts = parse_url($origin);
    if (!is_array($parts) || empty($parts['host'])) {
        return false;
    }
    $originHost = strtolower($parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''));
    $requestHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));

    if ($requestHost === '' || $originHost !== $requestHost) {
        return false;
    }

    // The same host over plain http (a visitor on the http:// address) may use
    // the public endpoints, but never together with an admin session: a page
    // tampered with in transit must not drive the API with an admin's cookie.
    $secureOrigin = strtolower((string) ($parts['scheme'] ?? '')) === 'https';
    return $secureOrigin || is_development() || empty($_COOKIE[SESSION_COOKIE]);
}

/* ============================================================
   Schema: the only tables and columns a request can reach
   ============================================================ */

function api_schema()
{
    return [
        'contacts' => [
            'columns' => [
                'name'           => ['type' => 'string', 'max' => 255, 'required' => true],
                'email'          => ['type' => 'email', 'max' => 255, 'required' => true],
                'phone'          => ['type' => 'string', 'max' => 50],
                'subject'        => ['type' => 'string', 'max' => 255, 'required' => true],
                'message'        => ['type' => 'text', 'max' => 5000, 'required' => true],
                'status'         => ['type' => 'slug', 'max' => 50],
                'internal_notes' => ['type' => 'text', 'max' => 10000],
                'response_email' => ['type' => 'text', 'max' => 10000],
            ],
            'public_insert'   => ['name', 'email', 'phone', 'subject', 'message'],
            'insert_defaults' => ['status' => 'new'],
            'admin_insert'    => ['name', 'email', 'phone', 'subject', 'message', 'status'],
            'admin_update'    => ['status', 'internal_notes', 'response_email'],
            'admin_delete'    => true,
            // Set by the server when a response is recorded; never from the request.
            'ignored'         => ['response_sent_at'],
        ],

        'applications' => [
            'columns' => [
                'product_type'          => ['type' => 'slug', 'max' => 100, 'required' => true],
                'full_name'             => ['type' => 'string', 'max' => 255, 'required' => true],
                'email'                 => ['type' => 'email', 'max' => 255, 'required' => true],
                'phone'                 => ['type' => 'string', 'max' => 50, 'required' => true],
                'national_id'           => ['type' => 'string', 'max' => 50],
                'date_of_birth'         => ['type' => 'date'],
                'residential_address'   => ['type' => 'text', 'max' => 2000],
                'business_type'         => ['type' => 'string', 'max' => 100],
                'business_name'         => ['type' => 'string', 'max' => 255],
                'business_registration' => ['type' => 'string', 'max' => 100],
                'monthly_income'        => ['type' => 'decimal'],
                'requested_amount'      => ['type' => 'decimal'],
                'loan_purpose'          => ['type' => 'text', 'max' => 5000],
                'employment_status'     => ['type' => 'string', 'max' => 50],
                'nearest_branch'        => ['type' => 'string', 'max' => 100],
                'bank_account'          => ['type' => 'string', 'max' => 50],
                'bank_name'             => ['type' => 'string', 'max' => 100],
                'additional_info'       => ['type' => 'text', 'max' => 5000],
                'status'                => ['type' => 'slug', 'max' => 50],
                'admin_notes'           => ['type' => 'text', 'max' => 10000],
                'approved_amount'       => ['type' => 'decimal'],
                'rejection_reason'      => ['type' => 'text', 'max' => 10000],
            ],
            'public_insert' => [
                'product_type', 'full_name', 'email', 'phone', 'national_id', 'date_of_birth',
                'residential_address', 'business_type', 'business_name', 'business_registration',
                'monthly_income', 'requested_amount', 'loan_purpose', 'employment_status',
                'nearest_branch', 'bank_account', 'bank_name', 'additional_info',
            ],
            'insert_defaults' => ['status' => 'pending'],
            'admin_insert' => [
                'product_type', 'full_name', 'email', 'phone', 'national_id', 'date_of_birth',
                'residential_address', 'business_type', 'business_name', 'business_registration',
                'monthly_income', 'requested_amount', 'loan_purpose', 'employment_status',
                'nearest_branch', 'bank_account', 'bank_name', 'additional_info', 'status',
            ],
            'admin_update' => ['status', 'admin_notes', 'approved_amount', 'rejection_reason'],
            'admin_delete' => true,
        ],

        'careers' => [
            'columns' => [
                'position_title'      => ['type' => 'string', 'max' => 255, 'required' => true],
                'department'          => ['type' => 'string', 'max' => 100],
                'description'         => ['type' => 'text', 'max' => 20000, 'required' => true],
                'qualifications'      => ['type' => 'text', 'max' => 20000, 'required' => true],
                'responsibilities'    => ['type' => 'text', 'max' => 20000],
                'job_type'            => ['type' => 'string', 'max' => 50],
                'experience_level'    => ['type' => 'string', 'max' => 50],
                'application_email'   => ['type' => 'email', 'max' => 255],
                'application_phone'   => ['type' => 'string', 'max' => 50],
                'image_url'           => ['type' => 'url', 'max' => 500],
                'validity_start_date' => ['type' => 'date'],
                'validity_end_date'   => ['type' => 'date'],
                'status'              => ['type' => 'slug', 'max' => 50],
            ],
            // What an anonymous visitor may read: live postings only.
            'public_where'   => "status = 'active' AND (validity_end_date IS NULL OR validity_end_date >= CURDATE())",
            'public_columns' => [
                'id', 'position_title', 'department', 'description', 'qualifications', 'responsibilities',
                'job_type', 'experience_level', 'application_email', 'application_phone', 'image_url',
                'validity_start_date', 'validity_end_date', 'status', 'created_at',
            ],
            'insert_defaults' => ['status' => 'active'],
            'admin_insert' => [
                'position_title', 'department', 'description', 'qualifications', 'responsibilities',
                'job_type', 'experience_level', 'application_email', 'application_phone', 'image_url',
                'validity_start_date', 'validity_end_date', 'status',
            ],
            'admin_update' => [
                'position_title', 'department', 'description', 'qualifications', 'responsibilities',
                'job_type', 'experience_level', 'application_email', 'application_phone', 'image_url',
                'validity_start_date', 'validity_end_date', 'status',
            ],
            'admin_delete' => true,
        ],

        'products' => [
            'columns' => [
                'name'        => ['type' => 'string', 'max' => 255, 'required' => true],
                'description' => ['type' => 'text', 'max' => 20000],
                'category'    => ['type' => 'string', 'max' => 100],
                'price'       => ['type' => 'decimal'],
                'features'    => ['type' => 'text', 'max' => 20000],
                'image_url'   => ['type' => 'url', 'max' => 500],
                'status'      => ['type' => 'slug', 'max' => 50],
            ],
            'public_where'   => "status = 'active'",
            'public_columns' => [
                'id', 'name', 'description', 'category', 'price', 'features', 'image_url',
                'status', 'created_at', 'updated_at',
            ],
            'insert_defaults' => ['status' => 'active'],
            'admin_insert' => ['name', 'description', 'category', 'price', 'features', 'image_url', 'status'],
            'admin_update' => ['name', 'description', 'category', 'price', 'features', 'image_url', 'status'],
            'admin_delete' => true,
        ],

        // Read-only here, and never with the password column. Accounts are
        // created with the create_user action or scripts/admin.php.
        'users' => [
            'columns'       => [],
            'admin_columns' => ['id', 'email', 'name', 'role', 'created_at', 'updated_at'],
        ],
    ];
}

/** Columns a table can be sorted by. */
function sortable_columns($def, $isAdmin)
{
    if (!$isAdmin) {
        return $def['public_columns'];
    }
    if (isset($def['admin_columns'])) {
        return $def['admin_columns'];
    }
    return array_merge(READ_ONLY_COLUMNS, array_keys($def['columns']));
}

/**
 * Validates one value against its column rule.
 * Returns [true, cleanValue] or [false, "reason"].
 */
function clean_value($column, $rule, $value)
{
    if (is_string($value)) {
        $value = trim($value);
    }
    if ($value === null || $value === '') {
        if (!empty($rule['required'])) {
            return [false, "$column is required"];
        }
        return [true, null];
    }
    if (is_bool($value) || !is_scalar($value)) {
        return [false, "$column has an invalid value"];
    }

    switch ($rule['type']) {
        case 'decimal':
            if (!is_numeric($value)) {
                return [false, "$column must be a number"];
            }
            $number = (float) $value;
            if ($number < 0 || $number > 9999999999.99) {
                return [false, "$column is out of range"];
            }
            return [true, number_format($number, 2, '.', '')];

        case 'date':
            $text = substr((string) $value, 0, 10);
            if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $text, $m) || !checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
                return [false, "$column must be a date (YYYY-MM-DD)"];
            }
            return [true, $text];
    }

    $text = (string) $value;
    if (isset($rule['max']) && text_length($text) > $rule['max']) {
        return [false, "$column is too long (max {$rule['max']} characters)"];
    }

    switch ($rule['type']) {
        case 'email':
            if (filter_var($text, FILTER_VALIDATE_EMAIL) === false) {
                return [false, "$column must be a valid email address"];
            }
            break;
        case 'slug':
            if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9_-]*$/', $text)) {
                return [false, "$column has an invalid value"];
            }
            break;
        case 'url':
            // http(s) or a path on this site; blocks javascript: and data: URLs.
            if (!preg_match('#^(https?://|/)#i', $text) || preg_match('/[\s<>"\']/', $text)) {
                return [false, "$column must be an http(s) URL"];
            }
            break;
    }

    return [true, $text];
}

/**
 * Picks and validates the writable columns out of request data.
 *
 * $strict: reject unknown columns (admin writes) instead of dropping them
 *          (public form posts, where a stray field must not lose the enquiry).
 * $requireAll: enforce "required" columns that are missing (inserts).
 */
function clean_row($def, $allowed, $data, $strict, $requireAll)
{
    $ignored = array_merge(READ_ONLY_COLUMNS, $def['ignored'] ?? []);
    $clean = [];

    foreach ($data as $column => $value) {
        $column = (string) $column;
        if (in_array($column, $ignored, true)) {
            continue;
        }
        if (!in_array($column, $allowed, true)) {
            if ($strict) {
                fail(400, "Unknown or read-only field: " . substr(preg_replace('/[^A-Za-z0-9_]/', '', $column), 0, 64));
            }
            continue;
        }
        list($ok, $result) = clean_value($column, $def['columns'][$column], $value);
        if (!$ok) {
            fail(400, $result);
        }
        $clean[$column] = $result;
    }

    if ($requireAll) {
        foreach ($allowed as $column) {
            if (!empty($def['columns'][$column]['required']) && !isset($clean[$column])) {
                fail(400, "$column is required");
            }
        }
    }

    return $clean;
}

/* ============================================================
   Sessions
   ============================================================ */

function session_cookie_options()
{
    return [
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        // Always Secure in production; only relaxed for plain-http local development.
        'secure'   => request_is_https() || !is_development(),
        'httponly' => true,
        'samesite' => 'Strict',
    ];
}

function open_session()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    ini_set('session.gc_maxlifetime', (string) SESSION_MAX_SECONDS);
    session_name(SESSION_COOKIE);
    session_set_cookie_params(session_cookie_options());
    session_start();
}

function close_session_for_good()
{
    open_session();
    $_SESSION = [];
    session_destroy();

    $options = session_cookie_options();
    unset($options['lifetime']);
    $options['expires'] = time() - 86400;
    setcookie(SESSION_COOKIE, '', $options);
}

/**
 * The logged-in admin for this request, or null.
 * The account is re-read on every request, so deleting or demoting a user
 * ends their access immediately.
 */
function current_admin($conn)
{
    static $resolved = false;
    static $admin = null;

    if ($resolved) {
        return $admin;
    }
    $resolved = true;

    if (empty($_COOKIE[SESSION_COOKIE])) {
        return null;
    }

    open_session();
    $now = time();
    $userId = $_SESSION['user_id'] ?? null;
    $expired = !$userId
        || ($now - (int) ($_SESSION['last_seen'] ?? 0)) > SESSION_IDLE_SECONDS
        || ($now - (int) ($_SESSION['started'] ?? 0)) > SESSION_MAX_SECONDS;

    if ($expired) {
        close_session_for_good();
        return null;
    }

    $stmt = $conn->prepare('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user || $user['role'] !== 'admin') {
        close_session_for_good();
        return null;
    }

    $_SESSION['last_seen'] = $now;
    session_write_close(); // release the session lock for parallel requests

    $admin = $user;
    return $admin;
}

function require_admin($conn)
{
    $admin = current_admin($conn);
    if (!$admin) {
        fail(401, 'Authentication required');
    }
    return $admin;
}

/* ============================================================
   Login rate limiting
   ============================================================ */

function ensure_login_attempts_table($conn)
{
    try {
        $conn->query(
            "CREATE TABLE IF NOT EXISTS login_attempts (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(191) NOT NULL,
                ip VARCHAR(45) NOT NULL,
                attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_login_attempts_email (email, attempted_at),
                INDEX idx_login_attempts_ip (ip, attempted_at),
                INDEX idx_login_attempts_time (attempted_at)
            ) DEFAULT CHARSET=utf8mb4"
        );
    } catch (mysqli_sql_exception $error) {
        // The database user may not be allowed to create tables. That is fine
        // when database/schema.sql has been run; if it has not, the queries
        // that follow fail and begin_login_attempt() carries on without limits.
    }
}

/** How many attempts in the current window share this email and/or address. */
function login_attempt_counts($conn, $email, $ip)
{
    $stmt = $conn->prepare(
        'SELECT COALESCE(SUM(email = ? AND ip = ?), 0) AS by_pair,
                COALESCE(SUM(email = ?), 0) AS by_email,
                COALESCE(SUM(ip = ?), 0) AS by_ip
           FROM login_attempts
          WHERE attempted_at > (NOW() - INTERVAL ' . LOGIN_WINDOW_MINUTES . ' MINUTE)
            AND (email = ? OR ip = ?)'
    );
    $stmt->bind_param('ssssss', $email, $ip, $email, $ip, $email, $ip);
    $stmt->execute();
    $counts = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return [
        'by_pair'  => (int) $counts['by_pair'],
        'by_email' => (int) $counts['by_email'],
        'by_ip'    => (int) $counts['by_ip'],
    ];
}

/**
 * $own is 1 when the counts already include the attempt being judged
 * (it may use the last free slot), 0 when they do not.
 */
function login_limit_reached($counts, $own)
{
    return $counts['by_pair'] >= LOGIN_MAX_PER_PAIR + $own
        || $counts['by_email'] >= LOGIN_MAX_PER_EMAIL + $own
        || $counts['by_ip'] >= LOGIN_MAX_PER_IP + $own;
}

/**
 * Applies the login limits and records this attempt. Ends the request with a
 * 429 when a limit has been reached.
 *
 * The working limit is per email AND address together, so someone hammering
 * an admin's email from elsewhere cannot lock that admin out. The per-email
 * and per-address ceilings are much higher and only bound large-scale abuse.
 *
 * If the login_attempts table cannot be used (database/schema.sql not run and
 * no right to create it), this logs the problem and lets the login go ahead
 * unlimited, so a missed setup step does not lock every admin out.
 */
function begin_login_attempt($conn, $email, $ip)
{
    $blocked = false;

    try {
        ensure_login_attempts_table($conn);

        // Nothing older than the window is ever needed again, so the table
        // stays small without waiting for a successful login.
        $conn->query('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL ' . LOGIN_WINDOW_MINUTES . ' MINUTE)');

        if (login_limit_reached(login_attempt_counts($conn, $email, $ip), 0)) {
            // Already blocked: refuse without recording anything, so further
            // tries neither grow the table nor push the block further out.
            $blocked = true;
        } else {
            // Record first, then count again with this attempt included: a
            // burst of parallel guesses cannot all slip in under the limit.
            $stmt = $conn->prepare('INSERT INTO login_attempts (email, ip) VALUES (?, ?)');
            $stmt->bind_param('ss', $email, $ip);
            $stmt->execute();
            $attemptId = (int) $stmt->insert_id;
            $stmt->close();

            if (login_limit_reached(login_attempt_counts($conn, $email, $ip), 1)) {
                // Decided before the clean-up below, so a failure there cannot
                // turn a refusal into a password check.
                $blocked = true;
                $stmt = $conn->prepare('DELETE FROM login_attempts WHERE id = ?');
                $stmt->bind_param('i', $attemptId);
                $stmt->execute();
                $stmt->close();
            }
        }
    } catch (mysqli_sql_exception $error) {
        error_log('[api.php] Login rate limiting is unavailable (run database/schema.sql): ' . $error->getMessage());
        if (!$blocked) {
            return;
        }
    }

    if ($blocked) {
        header('Retry-After: ' . (LOGIN_WINDOW_MINUTES * 60));
        fail(429, 'Too many login attempts. Try again in ' . LOGIN_WINDOW_MINUTES . ' minutes.');
    }
}

/** A correct password clears that email's attempts from that address. */
function clear_login_attempts($conn, $email, $ip)
{
    try {
        $stmt = $conn->prepare('DELETE FROM login_attempts WHERE email = ? AND ip = ?');
        $stmt->bind_param('ss', $email, $ip);
        $stmt->execute();
        $stmt->close();
    } catch (mysqli_sql_exception $error) {
        error_log('[api.php] Could not clear login attempts: ' . $error->getMessage());
    }
}

/* ============================================================
   Actions
   ============================================================ */

function action_login($conn, $input)
{
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;

    if (!is_string($email) || !is_string($password) || trim($email) === '' || $password === '') {
        fail(400, 'Email and password are required');
    }
    $email = strtolower(trim($email));
    // None of these can match an account: an over-long email, something that
    // is not an email address, or a password no stored hash could be for
    // (accounts are only created with passwords of up to 72 bytes).
    if (
        strlen($email) > 255
        || filter_var($email, FILTER_VALIDATE_EMAIL) === false
        || strlen($password) > PASSWORD_MAX_BYTES
        || strpos($password, "\0") !== false
    ) {
        fail(401, 'Invalid email or password');
    }
    $attemptKey = substr($email, 0, 191);
    $ip = substr(client_ip(), 0, 45);

    begin_login_attempt($conn, $attemptKey, $ip);

    $stmt = $conn->prepare('SELECT id, email, name, role, password, created_at, updated_at FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $valid = false;
    $newHash = null;

    if ($user) {
        $stored = (string) $user['password'];
        if (preg_match('/^[a-f0-9]{64}$/i', $stored)) {
            // Legacy unsalted SHA-256. The old API gave these hashes to anyone
            // who asked and let anyone overwrite them, so one is never
            // accepted: the account needs a new password from
            // "php scripts/admin.php create-admin <email>". The caller gets
            // the same answer as for a wrong password, and the hash below
            // only keeps the response time the same.
            password_hash($password, PASSWORD_DEFAULT);
            error_log('[api.php] Login refused for user id ' . (int) $user['id']
                . ': the account still has a legacy password hash. Reset it with scripts/admin.php create-admin.');
        } else {
            $valid = password_verify($password, $stored);
            if ($valid && password_needs_rehash($stored, PASSWORD_DEFAULT)) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
            }
        }
    } else {
        // Spend the same time as a real check so unknown emails are not revealed.
        password_hash($password, PASSWORD_DEFAULT);
    }

    if (!$valid) {
        fail(401, 'Invalid email or password');
    }

    if ($newHash) {
        $stmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
        $stmt->bind_param('si', $newHash, $user['id']);
        $stmt->execute();
        $stmt->close();
    }

    clear_login_attempts($conn, $attemptKey, $ip);

    if ($user['role'] !== 'admin') {
        fail(403, 'This account does not have admin access');
    }

    open_session();
    session_regenerate_id(true);
    $_SESSION = [
        'user_id'   => (int) $user['id'],
        'started'   => time(),
        'last_seen' => time(),
    ];
    session_write_close();

    unset($user['password']);
    respond(200, ['success' => true, 'message' => 'Login successful', 'user' => $user]);
}

function action_logout()
{
    if (!empty($_COOKIE[SESSION_COOKIE])) {
        close_session_for_good();
    }
    respond(200, ['success' => true, 'message' => 'Logged out']);
}

function action_session($conn)
{
    $admin = require_admin($conn);
    respond(200, ['success' => true, 'user' => $admin]);
}

function action_create_user($conn, $input)
{
    require_admin($conn);

    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    $name = $input['name'] ?? '';

    if (!is_string($email) || !is_string($password) || !is_string($name)) {
        fail(400, 'Email and password are required');
    }
    $email = strtolower(trim($email));
    $name = trim($name);

    if (strlen($email) > 255 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        fail(400, 'A valid email address is required');
    }
    if (strlen($password) < PASSWORD_MIN_LENGTH) {
        fail(400, 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters');
    }
    if (strlen($password) > PASSWORD_MAX_BYTES) {
        fail(400, 'Password is too long: the limit is ' . PASSWORD_MAX_BYTES
            . ' bytes (72 plain characters; fewer with accents or emoji)');
    }
    if (text_length($name) > 255) {
        fail(400, 'Name is too long');
    }
    if (strpos($password, "\0") !== false) {
        fail(400, 'Password contains an invalid character');
    }
    if ($name === '') {
        $name = substr($email, 0, (int) strpos($email, '@'));
    }

    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if ($exists) {
        fail(409, 'Email already registered');
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, 'admin')");
    $stmt->bind_param('sss', $email, $hash, $name);
    try {
        $stmt->execute();
    } catch (mysqli_sql_exception $error) {
        // 1062: another request created the same email a moment ago.
        if ((int) $error->getCode() === 1062) {
            fail(409, 'Email already registered');
        }
        throw $error;
    }
    $id = $stmt->insert_id;
    $stmt->close();

    respond(201, ['success' => true, 'message' => 'Admin user created', 'userId' => $id]);
}

/* ============================================================
   Table operations
   ============================================================ */

function table_definition($table)
{
    $schema = api_schema();
    if (!is_string($table) || !isset($schema[$table])) {
        fail(404, 'Unknown resource');
    }
    return $schema[$table];
}

function positive_id($value)
{
    if ((is_int($value) || (is_string($value) && ctype_digit($value))) && (int) $value > 0) {
        return (int) $value;
    }
    fail(400, 'A valid id is required');
}

function bind_all($stmt, $values)
{
    if ($values) {
        $stmt->bind_param(str_repeat('s', count($values)), ...$values);
    }
}

function table_read($conn, $table)
{
    $def = table_definition($table);
    $admin = current_admin($conn);

    if (!$admin && empty($def['public_where'])) {
        fail(401, 'Authentication required');
    }

    if ($admin) {
        $select = isset($def['admin_columns']) ? '`' . implode('`, `', $def['admin_columns']) . '`' : '*';
    } else {
        $select = '`' . implode('`, `', $def['public_columns']) . '`';
    }

    $where = [];
    $params = [];
    if (!$admin) {
        $where[] = '(' . $def['public_where'] . ')';
    }
    if (isset($_GET['id'])) {
        $where[] = 'id = ?';
        $params[] = (string) positive_id($_GET['id']);
    }

    $sql = "SELECT $select FROM `$table`";
    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $orderBy = 'id';
    $direction = 'ASC';
    if (isset($_GET['orderBy'])) {
        if (!is_string($_GET['orderBy']) || !in_array($_GET['orderBy'], sortable_columns($def, (bool) $admin), true)) {
            fail(400, 'Cannot sort by that field');
        }
        $orderBy = $_GET['orderBy'];
        $direction = (isset($_GET['order']) && is_string($_GET['order']) && strtoupper($_GET['order']) === 'ASC') ? 'ASC' : 'DESC';
    }
    $sql .= " ORDER BY `$orderBy` $direction";

    if (isset($_GET['limit'])) {
        $limit = is_string($_GET['limit']) ? (int) $_GET['limit'] : 0;
        $sql .= ' LIMIT ' . max(1, min(1000, $limit));
    }

    $stmt = $conn->prepare($sql);
    bind_all($stmt, $params);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    respond(200, $rows);
}

function table_insert($conn, $table, $data)
{
    $def = table_definition($table);
    $admin = current_admin($conn);

    $allowed = $admin ? ($def['admin_insert'] ?? null) : ($def['public_insert'] ?? null);
    if ($allowed === null) {
        fail($admin ? 405 : 401, $admin ? 'Records cannot be created here' : 'Authentication required');
    }
    if (!is_array($data) || !$data) {
        fail(400, 'Data is required');
    }

    $row = clean_row($def, $allowed, $data, (bool) $admin, true);
    foreach (($def['insert_defaults'] ?? []) as $column => $value) {
        if (!isset($row[$column])) {
            $row[$column] = $value;
        }
    }

    $columns = array_keys($row);
    $sql = "INSERT INTO `$table` (`" . implode('`, `', $columns) . '`) VALUES ('
        . implode(', ', array_fill(0, count($columns), '?')) . ')';

    $stmt = $conn->prepare($sql);
    bind_all($stmt, array_values($row));
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    respond(201, ['success' => true, 'id' => $id]);
}

function table_update($conn, $table, $id, $data)
{
    require_admin($conn);
    $def = table_definition($table);

    $allowed = $def['admin_update'] ?? null;
    if ($allowed === null) {
        fail(405, 'Records cannot be changed here');
    }
    if (!is_array($data) || !$data) {
        fail(400, 'ID and data are required');
    }
    $id = positive_id($id);

    $row = clean_row($def, $allowed, $data, true, false);
    if (!$row) {
        fail(400, 'Nothing to update');
    }
    foreach ($row as $column => $value) {
        if ($value === null && !empty($def['columns'][$column]['required'])) {
            fail(400, "$column is required");
        }
    }

    $stmt = $conn->prepare("SELECT id FROM `$table` WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$exists) {
        fail(404, 'Record not found');
    }

    $assignments = [];
    foreach (array_keys($row) as $column) {
        $assignments[] = "`$column` = ?";
    }
    if ($table === 'contacts' && isset($row['response_email'])) {
        $assignments[] = '`response_sent_at` = CURRENT_TIMESTAMP';
    }

    $values = array_values($row);
    $values[] = (string) $id;

    $stmt = $conn->prepare("UPDATE `$table` SET " . implode(', ', $assignments) . ' WHERE id = ?');
    bind_all($stmt, $values);
    $stmt->execute();
    $stmt->close();

    respond(200, ['success' => true]);
}

function table_delete($conn, $table, $id)
{
    require_admin($conn);
    $def = table_definition($table);

    if (empty($def['admin_delete'])) {
        fail(405, 'Records cannot be deleted here');
    }
    $id = positive_id($id);

    $stmt = $conn->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $deleted = $stmt->affected_rows;
    $stmt->close();

    if ($deleted < 1) {
        fail(404, 'Record not found');
    }
    respond(200, ['success' => true]);
}

/* ============================================================
   Request handling
   ============================================================ */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Vary: Origin');

// Database details never reach the caller: they go to the server log.
set_exception_handler(function ($error) {
    error_log('[api.php] ' . get_class($error) . ': ' . $error->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo json_encode(['error' => 'Server error. Please try again later.']);
    exit;
});

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Cross-origin access is limited to the site's own origins. Browsers attach
// Origin to every cross-site request and to every non-GET request, so this
// also stops another site from submitting writes with an admin's cookie.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    if (!is_string($origin) || !origin_allowed($origin)) {
        fail(403, 'Origin not allowed');
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 600');
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'], true)) {
    header('Allow: GET, POST, PUT, DELETE, OPTIONS');
    fail(405, 'Method not allowed');
}

$input = [];
if ($method === 'POST' || $method === 'PUT') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
    if (stripos(trim((string) $contentType), 'application/json') !== 0) {
        fail(415, 'Content-Type must be application/json');
    }
    $input = json_decode((string) file_get_contents('php://input'), true);
    // An object decodes to string keys; a JSON list ([1, 2]) is not accepted.
    if (!is_array($input) || isset($input[0])) {
        fail(400, 'Request body must be a JSON object');
    }
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
require __DIR__ . '/connection.php';

$action = $input['action'] ?? ($_GET['action'] ?? null);

if ($action !== null) {
    if (!is_string($action)) {
        fail(400, 'Unknown action');
    }
    if ($action === 'session' && $method === 'GET') {
        action_session($conn);
    }
    if ($method !== 'POST') {
        fail(405, 'Method not allowed');
    }
    switch ($action) {
        case 'check_connection':
            respond(200, ['success' => true, 'message' => 'API is ready']);
            // no break: respond() exits
        case 'login':
            action_login($conn, $input);
            // no break
        case 'logout':
            action_logout();
            // no break
        case 'session':
            action_session($conn);
            // no break
        case 'create_user':
            action_create_user($conn, $input);
            // no break
        default:
            // register, create_table and the init_*_table actions no longer exist.
            fail(400, 'Unknown action');
    }
}

$table = $input['table'] ?? ($_GET['table'] ?? null);
if ($table === null) {
    fail(400, 'Table name is required');
}

switch ($method) {
    case 'GET':
        table_read($conn, $table);
        // no break
    case 'POST':
        table_insert($conn, $table, $input['data'] ?? null);
        // no break
    case 'PUT':
        table_update($conn, $table, $input['id'] ?? null, $input['data'] ?? null);
        // no break
    case 'DELETE':
        table_delete($conn, $table, $_GET['id'] ?? null);
}
