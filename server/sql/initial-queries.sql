-- ========== 1. Core Entities ==========

-- Insured (person or business)
CREATE TABLE IF NOT EXISTS insured (
    insured_id INT AUTO_INCREMENT PRIMARY KEY,
    insured_name VARCHAR(255) NOT NULL
);

-- Insurer (insurance company)
CREATE TABLE IF NOT EXISTS insurer (
    insurer_id INT AUTO_INCREMENT PRIMARY KEY,
    insurer_name VARCHAR(255) NOT NULL
);

-- Policy Type (Auto, Home, etc.)
CREATE TABLE IF NOT EXISTS policy_type (
    policy_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

-- Vehicle (new table for storing vehicle info)
CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    insured_id INT NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    FOREIGN KEY (insured_id) REFERENCES insured(insured_id)
);

-- Policy
CREATE TABLE IF NOT EXISTS policy (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(100),
    insured_id INT,
    insurer_id INT,
    policy_type_id INT,
    expire_date DATE,
    premium DECIMAL(15,2),
    commission DECIMAL(15,2),

    FOREIGN KEY (insured_id) REFERENCES insured(insured_id),
    FOREIGN KEY (insurer_id) REFERENCES insurer(insurer_id),
    FOREIGN KEY (policy_type_id) REFERENCES policy_type(policy_type_id)
);

-- ========== 2. Commission Payments ==========

CREATE TABLE IF NOT EXISTS commission_payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_by VARCHAR(100),
    FOREIGN KEY (policy_id) REFERENCES policy(policy_id)
);


-- ========== 3. Claims ==========

-- Claim Status (Open, Closed, etc.)
CREATE TABLE IF NOT EXISTS claim_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL UNIQUE
);

-- Claim Subject Type (Car, Property, etc.)
CREATE TABLE IF NOT EXISTS claim_subject_type (
    subject_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Claim (updated to include vehicle_id)
CREATE TABLE IF NOT EXISTS claim (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT NOT NULL,
    insured_id INT NOT NULL,
    vehicle_id INT,
    accident_date DATE NOT NULL,
    accident_time TIME,
    accident_place VARCHAR(255),
    accident_reason TEXT,
    status_id INT NOT NULL,
    subject_type_id INT NOT NULL,
    subject_detail VARCHAR(255),
    FOREIGN KEY (policy_id) REFERENCES policy(policy_id),
    FOREIGN KEY (insured_id) REFERENCES insured(insured_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id),
    FOREIGN KEY (status_id) REFERENCES claim_status(status_id),
    FOREIGN KEY (subject_type_id) REFERENCES claim_subject_type(subject_type_id)
);

-- ========== 4. Employees and Roles ==========

CREATE TABLE IF NOT EXISTS company_roles (
    company_role_id INT AUTO_INCREMENT PRIMARY KEY,
    company_role_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_email VARCHAR(255) NOT NULL UNIQUE,
    active_employee INT NOT NULL,
    added_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_info (
    employee_info_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    employee_first_name VARCHAR(255) NOT NULL,
    employee_last_name VARCHAR(255) NOT NULL,
    employee_phone VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_pass (
    employee_pass_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    employee_password_hashed VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_role (
    employee_role_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    company_role_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (company_role_id) REFERENCES company_roles(company_role_id)
);

-- ========== 5. Seed Data ==========

-- Company roles
INSERT IGNORE INTO company_roles (company_role_name)
VALUES ('underwriter'), ('claim officer'), ('Admin');

-- Claim status
INSERT IGNORE INTO claim_status (status_name)
VALUES ('Open'), ('Closed'), ('In Review');

-- Claim subject types
INSERT IGNORE INTO claim_subject_type (type_name)
VALUES ('Car'), ('Property'), ('Health');

-- Admin user
INSERT IGNORE INTO employee (employee_id, employee_email, active_employee)
VALUES (1, 'admin@admin.com', 1);

-- Admin password (hashed "admin123")
INSERT IGNORE INTO employee_pass (employee_id, employee_password_hashed)
VALUES (1, '$2b$10$B6yvl4hECXploM.fCDbXz.brkhmgqNlawh9ZwbfkFX.F3xrs.15Xi');

-- Admin role
INSERT IGNORE INTO employee_role (employee_id, company_role_id)
VALUES (1, 3);  -- Admin
