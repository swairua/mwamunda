<?php
/**
 * Command-line administration. Never reachable from the web.
 *
 *   php scripts/admin.php init-schema
 *       Create any missing tables from database/schema.sql.
 *
 *   php scripts/admin.php list-users
 *       Show every account, its role, and whether its password must be reset
 *       (accounts from before the upgrade cannot sign in until it is).
 *
 *   php scripts/admin.php create-admin <email> [name]
 *       Create an admin, or turn an existing account into an admin and
 *       replace its password. The password is asked for on the terminal
 *       (or read from the ADMIN_PASSWORD environment variable).
 *
 *   php scripts/admin.php remove-user <email>
 *       Delete an account.
 *
 * Database settings come from the same environment variables as the site
 * (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME), read by connection.php.
 */

if (PHP_SAPI !== 'cli') {
    if (!isset($_SERVER['REQUEST_METHOD'])) {
        // Run from a shell, but "php" here is the CGI binary.
        echo "Run this with the command-line PHP binary (php-cli)." . PHP_EOL;
        exit(1);
    }
    http_response_code(404);
    exit;
}

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_BYTES = 72; // bcrypt ignores everything after 72 bytes

function stop($message)
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

function read_password()
{
    $fromEnv = getenv('ADMIN_PASSWORD');
    if ($fromEnv !== false && $fromEnv !== '') {
        return $fromEnv;
    }

    $hideInput = DIRECTORY_SEPARATOR === '/' && function_exists('shell_exec');
    fwrite(STDOUT, 'Password (' . MIN_PASSWORD_LENGTH . ' to ' . MAX_PASSWORD_BYTES . ' characters): ');
    if ($hideInput) {
        shell_exec('stty -echo');
    }
    $password = rtrim((string) fgets(STDIN), "\r\n");
    if ($hideInput) {
        shell_exec('stty echo');
        fwrite(STDOUT, PHP_EOL);
    }
    return $password;
}

$command = $argv[1] ?? '';
if (!in_array($command, ['init-schema', 'list-users', 'create-admin', 'remove-user'], true)) {
    stop("Usage:\n"
        . "  php scripts/admin.php init-schema\n"
        . "  php scripts/admin.php list-users\n"
        . "  php scripts/admin.php create-admin <email> [name]\n"
        . "  php scripts/admin.php remove-user <email>");
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    require __DIR__ . '/../connection.php';
} catch (mysqli_sql_exception $error) {
    stop('Could not connect to the database: ' . $error->getMessage());
}

if ($command === 'init-schema') {
    $sql = file_get_contents(__DIR__ . '/../database/schema.sql');
    if ($sql === false) {
        stop('database/schema.sql not found');
    }
    // Drop "--" comment lines, then run each statement.
    $sql = preg_replace('/^\s*--.*$/m', '', $sql);
    $count = 0;
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        $conn->query($statement);
        $count++;
    }
    echo "Schema is up to date ($count statements run)." . PHP_EOL;
    exit(0);
}

if ($command === 'list-users') {
    // "reset needed" marks an account that still has a pre-upgrade SHA-256
    // hash. It cannot sign in until create-admin gives it a new password.
    $result = $conn->query('SELECT id, email, name, role, password, created_at FROM users ORDER BY id');
    printf("%-5s %-40s %-25s %-8s %-13s %s\n", 'ID', 'Email', 'Name', 'Role', 'Password', 'Created');
    while ($row = $result->fetch_assoc()) {
        $legacy = preg_match('/^[a-f0-9]{64}$/i', (string) $row['password']) === 1;
        printf(
            "%-5s %-40s %-25s %-8s %-13s %s\n",
            $row['id'],
            $row['email'],
            (string) $row['name'],
            (string) $row['role'],
            $legacy ? 'reset needed' : 'ok',
            $row['created_at']
        );
    }
    exit(0);
}

$email = strtolower(trim((string) ($argv[2] ?? '')));
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    stop('A valid email address is required.');
}

if ($command === 'remove-user') {
    $stmt = $conn->prepare('DELETE FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    echo($stmt->affected_rows > 0 ? "Removed $email." : "No account found for $email.") . PHP_EOL;
    exit(0);
}

// create-admin
$password = read_password();
if (strlen($password) < MIN_PASSWORD_LENGTH) {
    stop('Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.');
}
if (strlen($password) > MAX_PASSWORD_BYTES) {
    stop('Password is too long: the limit is ' . MAX_PASSWORD_BYTES
        . ' bytes (72 plain characters; fewer with accents or emoji).');
}
if (strpos($password, "\0") !== false) {
    stop('Password contains an invalid character.');
}
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($existing) {
    $stmt = $conn->prepare("UPDATE users SET password = ?, role = 'admin' WHERE id = ?");
    $stmt->bind_param('si', $hash, $existing['id']);
    $stmt->execute();
    echo "Updated $email: now an admin, password replaced." . PHP_EOL;
} else {
    $name = trim((string) ($argv[3] ?? ''));
    if ($name === '') {
        $name = substr($email, 0, (int) strpos($email, '@'));
    }
    $stmt = $conn->prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, 'admin')");
    $stmt->bind_param('sss', $email, $hash, $name);
    $stmt->execute();
    echo "Created admin $email." . PHP_EOL;
}
