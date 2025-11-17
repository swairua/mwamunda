# Admin Login Error - Audit and Fixes

## Issue

The admin login page was displaying an error: **"Table name is required"** when attempting to log in.

### Root Cause Analysis

The error `"Table name is required"` only occurs in `api.php` when the API receives a request without:

1. A valid `action` parameter (like "login", "register", etc.)
2. A `table` parameter for CRUD operations

This indicated that the login request was reaching the API, but the login handler was not being executed.

**Root Cause**: The JSON request body parsing in `api.php` was fragile. If the JSON parsing returned an unexpected value or failed silently, the `$action` variable would not be set correctly, causing the login handler condition to fail.

## Fixes Applied

### 1. **Fixed JSON Parsing in api.php** (api.php lines 14-26)

**Problem**: The original code could fail silently if:

- The request body was empty
- JSON decoding failed
- JSON decoding returned a non-array value

**Original Code**:

```php
$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? null;
```

**Fixed Code**:

```php
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

$action = $input['action'] ?? null;
```

**Benefits**:

- Ensures `$input` is always an array
- Handles JSON parsing errors gracefully
- Prevents type errors when accessing array elements
- Ensures the action parameter is correctly extracted

### 2. **Added Environment Variable Support for API Configuration** (client/lib/config.ts)

**Problem**: The API URL was hardcoded to production, making development and testing difficult.

**Fix**: Added support for `VITE_API_BASE_URL` environment variable.

```typescript
const defaultApiUrl = "https://mwamunda.ziratech.com/api.php";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
```

**Benefits**:

- Allows different API endpoints for dev/staging/production
- Can be configured via `.env` file during build
- Maintains backward compatibility with default production URL

### 3. **Improved Database Connection Error Handling** (connection.php)

**Problem**: Database connection errors weren't being reported with proper HTTP status codes.

**Fix**:

- Added environment variable support for database configuration
- Added proper HTTP status code (500) for connection errors
- Added proper Content-Type header in error response

```php
$servername = getenv('DB_HOST') ?: "localhost";
$username = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASSWORD') ?: "";
$database = getenv('DB_NAME') ?: "mwamunda";

if ($conn->connect_error) {
    header("Content-Type: application/json");
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
```

**Benefits**:

- Database configuration can now be customized via environment variables
- Better error reporting for debugging
- Proper HTTP status codes for error responses

### 4. **Created Environment Configuration Documentation** (.env.example)

**Added**: Example environment variables file showing how to configure the API endpoint.

## Configuration for Different Environments

### Production

```
VITE_API_BASE_URL=https://mwamunda.ziratech.com/api.php
```

### Local Development

```
VITE_API_BASE_URL=http://localhost:8000/api.php
```

### Database Configuration (via environment variables)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mwamunda
```

## Testing the Fix

After applying these fixes:

1. **Login functionality** should work correctly
2. **JSON request parsing** is more robust
3. **Error messages** are more descriptive
4. **Environment configuration** is more flexible

## Files Modified

- `api.php` - Improved JSON parsing and request handling
- `connection.php` - Better error handling and environment variable support
- `client/lib/config.ts` - Added environment variable support for API URL
- `.env.example` - New file documenting environment variables

## Recommendations

1. **Test the login flow** with various credentials
2. **Monitor API errors** to ensure requests are being handled correctly
3. **Document environment variables** for your deployment team
4. **Consider adding request logging** for debugging in production
5. **Add rate limiting** to the login endpoint to prevent brute force attacks
