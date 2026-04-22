-- Update database schema for role-based access control
-- This script creates a roles table and updates the users table to reference it

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role_name, description) VALUES 
('ROLE_USER', 'Standard user with access to basic features'),
('ROLE_ADMIN', 'Administrator with full system access')
ON DUPLICATE KEY UPDATE role_name=role_name;

-- Add role_id foreign key to users table
ALTER TABLE users 
ADD COLUMN role_id BIGINT,
ADD CONSTRAINT fk_user_role 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Update existing users to reference the correct roles
UPDATE users u
INNER JOIN roles r ON u.role = r.role_name
SET u.role_id = r.id
WHERE u.role = r.role_name;

-- Create index on role_id for better performance
CREATE INDEX idx_user_role_id ON users(role_id);

-- Verify the changes
SELECT u.id, u.email, u.role, u.role_id, r.role_name as role_ref
FROM users u
LEFT JOIN roles r ON u.role_id = r.id;
