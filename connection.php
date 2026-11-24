<?php
// Database configuration
// Defaults target the production database on the same server as the app.
// Host-level environment variables (if provided) take precedence.
$servername = getenv('DB_HOST') ?: "localhost";
$username = getenv('DB_USER') ?: "mwamunda_web";
$password = getenv('DB_PASSWORD') ?: "Mwamunda@2026";
$database = getenv('DB_NAME') ?: "mwamunda_web";

header("Content-Type: application/json");

try {
    if (!class_exists('mysqli')) {
        throw new RuntimeException('mysqli extension is not available on this server');
    }

    $conn = @new mysqli($servername, $username, $password, $database);

    if ($conn->connect_errno) {
        throw new RuntimeException($conn->connect_error);
    }

    // Match the utf8mb4 tables created by the cleaned SQL dump.
    if (!$conn->set_charset("utf8mb4")) {
        throw new RuntimeException($conn->error);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}
