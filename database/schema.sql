-- Mwamunda database schema.
--
-- Safe to run more than once: every statement is CREATE TABLE IF NOT EXISTS,
-- so existing tables and their data are left untouched.
--
-- Run it with either:
--   php scripts/admin.php init-schema
--   or paste it into phpMyAdmin (SQL tab) on the site's database.
--
-- New tables are created as utf8mb4 (full UTF-8, including emoji). Tables that
-- already exist are not changed by this file; see "Character set" in
-- PRODUCTION_DEPLOYMENT.md for how to check them. The users table is left on
-- the database's default: a unique index on a 255-character utf8mb4 email is
-- too long for some older MySQL settings, and it holds no free-text fields.
--
-- The API no longer creates tables on request (the old init_*_table and
-- create_table actions were removed), so this file is the schema's home.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_attempts_email (email, attempted_at),
    INDEX idx_login_attempts_ip (ip, attempted_at),
    INDEX idx_login_attempts_time (attempted_at)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contacts (
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
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS applications (
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
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
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
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position_title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT NOT NULL,
    qualifications TEXT NOT NULL,
    responsibilities TEXT,
    job_type VARCHAR(50),
    experience_level VARCHAR(50),
    application_email VARCHAR(255),
    application_phone VARCHAR(50),
    image_url VARCHAR(500),
    validity_start_date DATE,
    validity_end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;
