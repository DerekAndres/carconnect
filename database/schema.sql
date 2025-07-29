-- Complete Database Schema for Vehicle Management System
-- MySQL 8.0+ Compatible

-- Drop existing database if exists and create new one
DROP DATABASE IF EXISTS vehicle_database;
CREATE DATABASE vehicle_database;
USE vehicle_database;

-- Set character set and collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('admin', 'dealer', 'user') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicles table
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    mileage INT NOT NULL DEFAULT 0,
    condition ENUM('new', 'used', 'certified_pre_owned') NOT NULL DEFAULT 'used',
    description TEXT,
    vin VARCHAR(17) UNIQUE,
    engine VARCHAR(100),
    transmission ENUM('manual', 'automatic', 'cvt') DEFAULT 'automatic',
    fuel_type ENUM('gasoline', 'diesel', 'hybrid', 'electric') DEFAULT 'gasoline',
    drivetrain ENUM('fwd', 'rwd', 'awd', '4wd') DEFAULT 'fwd',
    exterior_color VARCHAR(30),
    interior_color VARCHAR(30),
    doors TINYINT DEFAULT 4,
    seats TINYINT DEFAULT 5,
    city_mpg INT,
    highway_mpg INT,
    status ENUM('available', 'sold', 'pending', 'unavailable') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_vehicles_make (make),
    INDEX idx_vehicles_model (model),
    INDEX idx_vehicles_year (year),
    INDEX idx_vehicles_price (price),
    INDEX idx_vehicles_condition (condition),
    INDEX idx_vehicles_status (status),
    INDEX idx_vehicles_featured (featured),
    INDEX idx_vehicles_user_id (user_id),
    INDEX idx_vehicles_created_at (created_at),
    CONSTRAINT chk_year CHECK (year >= 1900 AND year <= YEAR(CURDATE()) + 2),
    CONSTRAINT chk_price CHECK (price >= 0),
    CONSTRAINT chk_mileage CHECK (mileage >= 0),
    CONSTRAINT chk_doors CHECK (doors >= 2 AND doors <= 6),
    CONSTRAINT chk_seats CHECK (seats >= 1 AND seats <= 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicle_media table for images and videos
CREATE TABLE vehicle_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_type ENUM('image', 'video') DEFAULT 'image',
    mime_type VARCHAR(100),
    file_size INT,
    width INT,
    height INT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_media_vehicle_id (vehicle_id),
    INDEX idx_vehicle_media_is_primary (is_primary),
    INDEX idx_vehicle_media_display_order (display_order),
    INDEX idx_vehicle_media_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicle_features table for additional features
CREATE TABLE vehicle_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255),
    category ENUM('safety', 'technology', 'comfort', 'performance', 'exterior', 'interior') DEFAULT 'comfort',
    is_standard BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_features_vehicle_id (vehicle_id),
    INDEX idx_vehicle_features_category (category),
    UNIQUE KEY uk_vehicle_feature (vehicle_id, feature_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create inquiries table for customer inquiries
CREATE TABLE inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    message TEXT,
    inquiry_type ENUM('general', 'test_drive', 'financing', 'trade_in') DEFAULT 'general',
    status ENUM('new', 'contacted', 'scheduled', 'completed', 'closed') DEFAULT 'new',
    preferred_contact ENUM('email', 'phone', 'text') DEFAULT 'email',
    preferred_time VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_inquiries_vehicle_id (vehicle_id),
    INDEX idx_inquiries_status (status),
    INDEX idx_inquiries_inquiry_type (inquiry_type),
    INDEX idx_inquiries_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create favorites table for user favorites
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_vehicle_favorite (user_id, vehicle_id),
    INDEX idx_favorites_user_id (user_id),
    INDEX idx_favorites_vehicle_id (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create saved_searches table
CREATE TABLE saved_searches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    search_name VARCHAR(100) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    year_min INT,
    year_max INT,
    price_min DECIMAL(12,2),
    price_max DECIMAL(12,2),
    mileage_max INT,
    condition_filter VARCHAR(100),
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_saved_searches_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create activity_logs table for tracking changes
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    vehicle_id INT,
    action ENUM('created', 'updated', 'deleted', 'viewed', 'favorited', 'inquired') NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_vehicle_id (vehicle_id),
    INDEX idx_activity_logs_action (action),
    INDEX idx_activity_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create views for common queries

-- View for vehicles with primary image
CREATE VIEW vehicles_with_primary_image AS
SELECT 
    v.*,
    vm.id as primary_image_id,
    vm.url as primary_image_url,
    vm.thumbnail_url as primary_thumbnail_url,
    vm.alt_text as primary_image_alt
FROM vehicles v
LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE;

-- View for featured vehicles
CREATE VIEW featured_vehicles AS
SELECT 
    v.*,
    vm.url as primary_image_url,
    vm.thumbnail_url as primary_thumbnail_url,
    (SELECT COUNT(*) FROM vehicle_media WHERE vehicle_id = v.id) as image_count
FROM vehicles v
LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE
WHERE v.featured = TRUE AND v.status = 'available'
ORDER BY v.updated_at DESC;

-- View for vehicle search with aggregated data
CREATE VIEW vehicle_search_view AS
SELECT 
    v.*,
    vm.url as primary_image_url,
    vm.thumbnail_url as primary_thumbnail_url,
    (SELECT COUNT(*) FROM vehicle_media WHERE vehicle_id = v.id) as image_count,
    (SELECT COUNT(*) FROM inquiries WHERE vehicle_id = v.id) as inquiry_count,
    CONCAT(v.year, ' ', v.make, ' ', v.model) as full_title
FROM vehicles v
LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE
WHERE v.status = 'available';

-- Create stored procedures

-- Procedure to get vehicle with all related data
DELIMITER //
CREATE PROCEDURE GetVehicleDetails(IN vehicle_id INT)
BEGIN
    -- Get vehicle data
    SELECT * FROM vehicles WHERE id = vehicle_id;
    
    -- Get vehicle media
    SELECT * FROM vehicle_media WHERE vehicle_id = vehicle_id ORDER BY display_order ASC, created_at ASC;
    
    -- Get vehicle features
    SELECT * FROM vehicle_features WHERE vehicle_id = vehicle_id ORDER BY category, feature_name;
    
    -- Get inquiry count
    SELECT COUNT(*) as inquiry_count FROM inquiries WHERE vehicle_id = vehicle_id;
END //

-- Procedure to search vehicles with filters
CREATE PROCEDURE SearchVehicles(
    IN p_make VARCHAR(50),
    IN p_model VARCHAR(50),
    IN p_year_min INT,
    IN p_year_max INT,
    IN p_price_min DECIMAL(12,2),
    IN p_price_max DECIMAL(12,2),
    IN p_mileage_max INT,
    IN p_condition VARCHAR(50),
    IN p_fuel_type VARCHAR(50),
    IN p_transmission VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET @sql = 'SELECT v.*, vm.url as primary_image_url, vm.thumbnail_url as primary_thumbnail_url 
                FROM vehicles v 
                LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE
                WHERE v.status = "available"';
    
    IF p_make IS NOT NULL AND p_make != '' THEN
        SET @sql = CONCAT(@sql, ' AND v.make LIKE "%', p_make, '%"');
    END IF;
    
    IF p_model IS NOT NULL AND p_model != '' THEN
        SET @sql = CONCAT(@sql, ' AND v.model LIKE "%', p_model, '%"');
    END IF;
    
    IF p_year_min IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND v.year >= ', p_year_min);
    END IF;
    
    IF p_year_max IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND v.year <= ', p_year_max);
    END IF;
    
    IF p_price_min IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND v.price >= ', p_price_min);
    END IF;
    
    IF p_price_max IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND v.price <= ', p_price_max);
    END IF;
    
    IF p_mileage_max IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND v.mileage <= ', p_mileage_max);
    END IF;
    
    IF p_condition IS NOT NULL AND p_condition != '' THEN
        SET @sql = CONCAT(@sql, ' AND v.condition = "', p_condition, '"');
    END IF;
    
    IF p_fuel_type IS NOT NULL AND p_fuel_type != '' THEN
        SET @sql = CONCAT(@sql, ' AND v.fuel_type = "', p_fuel_type, '"');
    END IF;
    
    IF p_transmission IS NOT NULL AND p_transmission != '' THEN
        SET @sql = CONCAT(@sql, ' AND v.transmission = "', p_transmission, '"');
    END IF;
    
    SET @sql = CONCAT(@sql, ' ORDER BY v.featured DESC, v.updated_at DESC');
    
    IF p_limit IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' LIMIT ', p_limit);
    END IF;
    
    IF p_offset IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' OFFSET ', p_offset);
    END IF;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@example.com', '$2b$10$example_hash', 'Admin', 'User', 'admin'),
('dealer1', 'dealer@example.com', '$2b$10$example_hash', 'John', 'Dealer', 'dealer'),
('user1', 'user@example.com', '$2b$10$example_hash', 'Jane', 'Customer', 'user');

-- Insert sample vehicles
INSERT INTO vehicles (
    make, model, year, price, mileage, condition, description, 
    engine, transmission, fuel_type, drivetrain, exterior_color, 
    interior_color, doors, seats, city_mpg, highway_mpg, featured, user_id
) VALUES
('Toyota', 'Camry', 2023, 28999.00, 15000, 'used', 'Excellent condition Toyota Camry with low mileage', 
 '2.5L 4-Cylinder', 'automatic', 'gasoline', 'fwd', 'Silver', 'Black', 4, 5, 28, 39, TRUE, 1),
('Honda', 'Civic', 2022, 24500.00, 22000, 'used', 'Reliable Honda Civic, perfect for daily commuting',
 '2.0L 4-Cylinder', 'cvt', 'gasoline', 'fwd', 'Blue', 'Gray', 4, 5, 31, 40, FALSE, 1),
('Ford', 'F-150', 2023, 45999.00, 8000, 'used', 'Powerful F-150 truck with excellent towing capacity',
 '3.5L V6 EcoBoost', 'automatic', 'gasoline', '4wd', 'Black', 'Black', 4, 5, 20, 26, TRUE, 2),
('Tesla', 'Model 3', 2023, 42999.00, 5000, 'used', 'Electric luxury sedan with autopilot features',
 'Electric Motor', 'automatic', 'electric', 'rwd', 'White', 'White', 4, 5, 0, 0, TRUE, 2),
('BMW', 'X5', 2022, 55999.00, 18000, 'certified_pre_owned', 'Luxury SUV with premium features',
 '3.0L Turbo I6', 'automatic', 'gasoline', 'awd', 'Gray', 'Brown', 4, 7, 21, 26, FALSE, 1);

-- Insert sample vehicle features
INSERT INTO vehicle_features (vehicle_id, feature_name, category) VALUES
(1, 'Backup Camera', 'safety'),
(1, 'Bluetooth Connectivity', 'technology'),
(1, 'Heated Seats', 'comfort'),
(2, 'Lane Departure Warning', 'safety'),
(2, 'Apple CarPlay', 'technology'),
(3, 'Tow Package', 'performance'),
(3, '4WD System', 'performance'),
(4, 'Autopilot', 'technology'),
(4, 'Supercharging', 'technology'),
(5, 'Premium Sound System', 'technology'),
(5, 'Panoramic Sunroof', 'comfort');

-- Insert sample inquiries
INSERT INTO inquiries (vehicle_id, customer_name, customer_email, customer_phone, message, inquiry_type) VALUES
(1, 'Mike Johnson', 'mike@email.com', '555-0123', 'Interested in test driving the Camry', 'test_drive'),
(3, 'Sarah Wilson', 'sarah@email.com', '555-0456', 'Can you provide financing options?', 'financing'),
(4, 'David Brown', 'david@email.com', '555-0789', 'What is the warranty on this Tesla?', 'general');

-- Create indexes for performance optimization
CREATE INDEX idx_vehicles_search ON vehicles (make, model, year, price, condition, status);
CREATE INDEX idx_vehicles_price_range ON vehicles (price, status);
CREATE INDEX idx_vehicles_year_range ON vehicles (year, status);
CREATE FULLTEXT INDEX idx_vehicles_description ON vehicles (description);

-- Create triggers for logging
DELIMITER //

CREATE TRIGGER vehicle_insert_log
AFTER INSERT ON vehicles
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (vehicle_id, action, details)
    VALUES (NEW.id, 'created', JSON_OBJECT('make', NEW.make, 'model', NEW.model, 'year', NEW.year));
END //

CREATE TRIGGER vehicle_update_log
AFTER UPDATE ON vehicles
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (vehicle_id, action, details)
    VALUES (NEW.id, 'updated', JSON_OBJECT('old_price', OLD.price, 'new_price', NEW.price));
END //

DELIMITER ;

-- Final optimizations
ANALYZE TABLE vehicles;
ANALYZE TABLE vehicle_media;
ANALYZE TABLE vehicle_features;
ANALYZE TABLE inquiries;

-- Show tables and their sizes
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'vehicle_database'
ORDER BY TABLE_NAME;
