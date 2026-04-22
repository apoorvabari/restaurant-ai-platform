-- Run this SQL script in your MySQL database to fix the auth0sub column
-- Connect to MySQL: mysql -u root -p restaurant_db
-- Then run: source fix_auth0sub.sql

USE restaurant_db;

-- Make auth0sub column nullable for local authentication
ALTER TABLE users MODIFY COLUMN auth0sub VARCHAR(100) NULL;

-- Verify the change
DESCRIBE users;
