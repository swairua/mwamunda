<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "connection.php";

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents("php://input");
$input = !empty($rawInput) ? json_decode($rawInput, true) : [];

// Handle JSON decode errors
if (json_last_error() !== JSON_ERROR_NONE) {
    $input = [];
}

// Ensure $input is an array
if (!is_array($input)) {
    $input = [];
}

// Action (optional)
$action = $input['action'] ?? null;

// Table name
$table = $input['table'] ?? $_GET['table'] ?? null;

// Utility function for password hashing
function hashPassword($password) {
    return hash('sha256', $password);
}

// Utility function for verifying password
function verifyPassword($password, $hash) {
    return hash('sha256', $password) === $hash;
}

// Handle connection check
if ($action === "check_connection" && $method === "POST") {
    echo json_encode(["success" => true, "message" => "API is ready"]);
    exit;
}

// Handle authentication actions
if ($action === "register" && $method === "POST") {
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    $name = $input['name'] ?? null;

    if (!$email || !$password) {
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    $hashedPassword = hashPassword($password);
    $name = $name ?: substr($email, 0, strpos($email, '@'));

    $sql = "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, 'user')";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["error" => "Database error: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("sss", $email, $hashedPassword, $name);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "User registered successfully",
            "userId" => $stmt->insert_id
        ]);
    } else {
        // Check if it's a duplicate email error
        if (strpos($stmt->error, "Duplicate entry") !== false) {
            echo json_encode(["error" => "Email already registered"]);
        } else {
            echo json_encode(["error" => "Registration failed: " . $stmt->error]);
        }
    }
    exit;
}

if ($action === "login" && $method === "POST") {
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;

    if (!$email || !$password) {
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["error" => "Invalid email or password"]);
        exit;
    }

    $user = $result->fetch_assoc();

    if (!verifyPassword($password, $user['password'])) {
        echo json_encode(["error" => "Invalid email or password"]);
        exit;
    }

    // Return user without password
    $userWithoutPassword = $user;
    unset($userWithoutPassword['password']);

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => $userWithoutPassword,
        "token" => base64_encode(json_encode($userWithoutPassword))
    ]);
    exit;
}

if ($action === "init_users_table" && $method === "POST") {
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Users table created successfully"]);
    } else {
        if (strpos($conn->error, "already exists") !== false) {
            echo json_encode(["success" => true, "message" => "Users table already exists"]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
    }
    exit;
}

if ($action === "init_contacts_table" && $method === "POST") {
    $sql = "CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        internal_notes TEXT,
        response_email TEXT,
        response_sent_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Contacts table created successfully"]);
    } else {
        if (strpos($conn->error, "already exists") !== false) {
            echo json_encode(["success" => true, "message" => "Contacts table already exists"]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
    }
    exit;
}

if ($action === "init_applications_table" && $method === "POST") {
    $sql = "CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_type VARCHAR(100) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        national_id VARCHAR(50),
        date_of_birth DATE,
        residential_address TEXT,
        business_type VARCHAR(100),
        business_name VARCHAR(255),
        business_registration VARCHAR(100),
        monthly_income DECIMAL(12, 2),
        requested_amount DECIMAL(12, 2),
        loan_purpose TEXT,
        employment_status VARCHAR(50),
        nearest_branch VARCHAR(100),
        bank_account VARCHAR(50),
        bank_name VARCHAR(100),
        additional_info TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        admin_notes TEXT,
        approved_amount DECIMAL(12, 2),
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Applications table created successfully"]);
    } else {
        if (strpos($conn->error, "already exists") !== false) {
            echo json_encode(["success" => true, "message" => "Applications table already exists"]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
    }
    exit;
}

if ($action === "init_products_table" && $method === "POST") {
    $sql = "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(12, 2),
        features TEXT,
        image_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Products table created successfully"]);
    } else {
        if (strpos($conn->error, "already exists") !== false) {
            echo json_encode(["success" => true, "message" => "Products table already exists"]);
        } else {
            echo json_encode(["error" => $conn->error]);
        }
    }
    exit;
}

if (!$table) {
    echo json_encode(["error" => "Table name is required"]);
    exit;
}


/* ============================================================
   1. CREATE TABLE
   ============================================================ */
if ($action === "create_table") {

    if (!isset($input['columns']) || !is_array($input['columns'])) {
        echo json_encode(["error" => "Column definitions are required"]);
        exit;
    }

    $columns = $input['columns'];

    // Build column SQL
    $columnSqlParts = ["id INT AUTO_INCREMENT PRIMARY KEY"];

    foreach ($columns as $colName => $type) {
        $columnSqlParts[] = "$colName $type";
    }

    $columnSql = implode(", ", $columnSqlParts);

    $sql = "CREATE TABLE IF NOT EXISTS $table ($columnSql)";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Table created successfully"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }

    exit;
}


/* ============================================================
   2. STANDARD CRUD OPERATIONS
   ============================================================ */
switch ($method) {

    // READ
    case "GET":
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM $table WHERE id=?");
            $stmt->bind_param("i", $id);
        } else {
            $sql = "SELECT * FROM $table";

            // Support ordering by column
            if (isset($_GET['orderBy'])) {
                $orderBy = preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['orderBy']);
                $order = isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC' ? 'ASC' : 'DESC';
                $sql .= " ORDER BY $orderBy $order";
            }

            // Support limiting results
            if (isset($_GET['limit'])) {
                $limit = intval($_GET['limit']);
                $sql .= " LIMIT $limit";
            }

            $stmt = $conn->prepare($sql);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];

        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

        echo json_encode($rows);
        break;

    // CREATE (INSERT)
    case "POST":
        if (!isset($input['data'])) {
            echo json_encode(["error" => "Data is required"]);
            exit;
        }

        if ($action === "create_table") {
            // Already handled above
            exit;
        }

        $columns = array_keys($input['data']);
        $values = array_values($input['data']);

        $colString = implode(",", $columns);
        $placeholders = implode(",", array_fill(0, count($values), "?"));

        $stmt = $conn->prepare("INSERT INTO $table ($colString) VALUES ($placeholders)");

        $types = str_repeat("s", count($values));
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    // UPDATE
    case "PUT":
        if (!isset($input['id']) || !isset($input['data'])) {
            echo json_encode(["error" => "ID and data are required"]);
            exit;
        }

        $id = intval($input['id']);
        $setParts = [];
        $values = [];

        foreach ($input['data'] as $col => $val) {
            $setParts[] = "$col=?";
            $values[] = $val;
        }

        $setString = implode(",", $setParts);
        $sql = "UPDATE $table SET $setString WHERE id=?";

        $stmt = $conn->prepare($sql);

        $values[] = $id;
        $types = str_repeat("s", count($values) - 1) . "i";

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    // DELETE
    case "DELETE":
        if (!isset($_GET['id'])) {
            echo json_encode(["error" => "ID is required"]);
            exit;
        }

        $id = intval($_GET['id']);

        $stmt = $conn->prepare("DELETE FROM $table WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
}
?>
