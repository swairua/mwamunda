<?php
/**
 * Database connection. Defines $conn (mysqli).
 *
 * Settings come from the server environment:
 *   DB_HOST (default "localhost"), DB_USER, DB_PASSWORD, DB_NAME.
 *
 * They are looked up the same way api.php reads its own settings, because
 * hosts differ in where they put them: the process environment, Apache
 * SetEnv ($_SERVER), or SetEnv after a rewrite ($_SERVER['REDIRECT_...']).
 */

// This file sits in the web root. If it is requested directly, or included
// from somewhere that has not hidden errors, a failed connection must not
// print the host, user or password to the visitor.
if (PHP_SAPI !== 'cli') {
    ini_set('display_errors', '0');
}

// Shared hosting often has no way to set environment variables, so the
// settings can also live in config.local.php next to this file. That file is
// never committed (.gitignore) and never served (.htaccess); it returns an
// array, e.g. <?php return ['DB_USER' => '...', 'DB_PASSWORD' => '...', 'DB_NAME' => '...'];
// The server environment, when set, takes precedence.
$dbLocal = [];
if (is_file(__DIR__ . '/config.local.php')) {
    $loaded = require __DIR__ . '/config.local.php';
    if (is_array($loaded)) {
        $dbLocal = $loaded;
    }
}

$dbSetting = function ($key) use ($dbLocal) {
    $value = getenv($key);
    if ($value === false || $value === '') {
        $value = $_SERVER[$key] ?? ($_SERVER['REDIRECT_' . $key] ?? ($_ENV[$key] ?? ($dbLocal[$key] ?? null)));
    }
    return ($value === null || $value === false || $value === '') ? null : (string) $value;
};

// The reason goes to the server log (and the terminal for scripts/admin.php),
// never to a web visitor.
$dbStop = function ($reason) {
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, $reason . PHP_EOL);
        exit(1);
    }
    error_log('[connection.php] ' . $reason);
    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code(500);
    }
    die(json_encode(['error' => 'Server error. Please try again later.']));
};

$servername = $dbSetting('DB_HOST') ?? 'localhost';
$username = $dbSetting('DB_USER');
$password = $dbSetting('DB_PASSWORD') ?? '';
$database = $dbSetting('DB_NAME');

if ($username === null || $database === null) {
    if ($dbSetting('APP_ENV') === 'development') {
        // Local development only: a stock local MySQL.
        $username = $username ?? 'root';
        $database = $database ?? 'mwamunda';
    } else {
        $dbStop('Database settings are missing: set DB_USER, DB_PASSWORD and DB_NAME '
            . '(and DB_HOST if it is not localhost) in the server environment or in config.local.php.');
    }
}

// Create connection. mysqli throws on failure from PHP 8.1 (and whenever the
// caller has asked it to); older versions set connect_error instead.
try {
    $conn = new mysqli($servername, $username, $password, $database);
} catch (mysqli_sql_exception $error) {
    $dbStop('Database connection failed: ' . $error->getMessage());
}
if ($conn->connect_error) {
    $dbStop('Database connection failed: ' . $conn->connect_error);
}

// utf8mb4 is full UTF-8. Plain "utf8" in MySQL is 3-byte only, and a 4-byte
// character such as an emoji in a form message would make the insert fail.
$conn->set_charset('utf8mb4');
