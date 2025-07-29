-- ========================================
-- SISTEMA DE GESTIÓN DE VEHÍCULOS
-- Base de Datos SQL Schema
-- ========================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS car_connect_db;
USE car_connect_db;

-- ========================================
-- TABLA DE VEHÍCULOS PRINCIPAL
-- ========================================
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year YEAR NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    mileage INT DEFAULT 0,
    fuel_type ENUM('Gasolina', 'Diesel', 'Híbrido', 'Eléctrico') NOT NULL DEFAULT 'Gasolina',
    transmission ENUM('Automatico', 'Mecanico') NOT NULL DEFAULT 'Automatico',
    description TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    condition_type ENUM('Nuevo', 'Usado') NOT NULL DEFAULT 'Usado',
    price_type ENUM('Contado', 'Financiado') NOT NULL DEFAULT 'Contado',
    vehicle_type ENUM('SUV', 'Sedan', 'Pickup') NOT NULL DEFAULT 'Sedan',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para búsqueda
    INDEX idx_make (make),
    INDEX idx_model (model),
    INDEX idx_year (year),
    INDEX idx_price (price),
    INDEX idx_vehicle_type (vehicle_type),
    INDEX idx_visible (is_visible),
    INDEX idx_featured (is_featured)
);

-- ========================================
-- TABLA DE MEDIOS (IMÁGENES Y VIDEOS)
-- ========================================
CREATE TABLE vehicle_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('image', 'video') NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    file_size BIGINT NOT NULL, -- en bytes
    is_primary BOOLEAN DEFAULT FALSE, -- imagen principal
    display_order INT DEFAULT 0, -- orden de visualización
    
    -- Metadatos de imagen/video
    width INT,
    height INT,
    duration INT, -- para videos en segundos
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_vehicle_media (vehicle_id),
    INDEX idx_media_type (file_type),
    INDEX idx_primary_media (is_primary),
    INDEX idx_display_order (display_order)
);

-- ========================================
-- TABLA DE CARACTERÍSTICAS
-- ========================================
CREATE TABLE vehicle_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    category ENUM('motor', 'interior', 'tecnologia', 'seguridad', 'exterior') NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_vehicle_features (vehicle_id),
    INDEX idx_feature_category (category),
    
    -- Evitar duplicados
    UNIQUE KEY unique_vehicle_feature (vehicle_id, feature_name)
);

-- ========================================
-- TABLA DE DATOS ADMINISTRATIVOS
-- ========================================
CREATE TABLE vehicle_admin_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL UNIQUE,
    
    -- Fechas y ubicación
    fecha_llegada_honduras DATE,
    fecha_salida_eeuu DATE,
    estado_compra_eeuu VARCHAR(100),
    pagina_web_compra ENUM('Copart', 'IAAI', 'Otro'),
    nombre_en_papeles VARCHAR(200),
    
    -- Costos en USD
    costo_chocado DECIMAL(10,2),
    costo_reparado DECIMAL(10,2) NULL, -- NULL = N/A
    
    -- Costos de venta en Lempiras
    costo_venta_chocado DECIMAL(12,2),
    costo_venta_reparado DECIMAL(12,2),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- ========================================
-- TABLA DE USUARIOS (OPCIONAL)
-- ========================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- ========================================
-- TABLA DE LOGS DE ACTIVIDAD (OPCIONAL)
-- ========================================
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_user_activity (user_id),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista de vehículos con su imagen principal
CREATE VIEW vehicles_with_primary_image AS
SELECT 
    v.*,
    vm.file_path as primary_image_path,
    vm.file_name as primary_image_name
FROM vehicles v
LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE;

-- Vista de vehículos completos con datos admin
CREATE VIEW vehicles_complete AS
SELECT 
    v.*,
    vad.fecha_llegada_honduras,
    vad.fecha_salida_eeuu,
    vad.estado_compra_eeuu,
    vad.pagina_web_compra,
    vad.nombre_en_papeles,
    vad.costo_chocado,
    vad.costo_reparado,
    vad.costo_venta_chocado,
    vad.costo_venta_reparado,
    vm.file_path as primary_image_path,
    COUNT(vmedia.id) as total_media_count
FROM vehicles v
LEFT JOIN vehicle_admin_data vad ON v.id = vad.vehicle_id
LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE
LEFT JOIN vehicle_media vmedia ON v.id = vmedia.vehicle_id
GROUP BY v.id;

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

DELIMITER //

-- Procedimiento para crear un vehículo completo
CREATE PROCEDURE CreateVehicle(
    IN p_make VARCHAR(100),
    IN p_model VARCHAR(100),
    IN p_year YEAR,
    IN p_price DECIMAL(12,2),
    IN p_mileage INT,
    IN p_fuel_type VARCHAR(20),
    IN p_transmission VARCHAR(20),
    IN p_description TEXT,
    IN p_vehicle_type VARCHAR(20),
    IN p_condition_type VARCHAR(20),
    IN p_price_type VARCHAR(20),
    OUT p_vehicle_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    INSERT INTO vehicles (
        make, model, year, price, mileage, fuel_type, 
        transmission, description, vehicle_type, condition_type, price_type
    ) VALUES (
        p_make, p_model, p_year, p_price, p_mileage, p_fuel_type,
        p_transmission, p_description, p_vehicle_type, p_condition_type, p_price_type
    );
    
    SET p_vehicle_id = LAST_INSERT_ID();
    
    COMMIT;
END//

-- Procedimiento para agregar medio a un vehículo
CREATE PROCEDURE AddVehicleMedia(
    IN p_vehicle_id INT,
    IN p_file_name VARCHAR(255),
    IN p_file_path VARCHAR(500),
    IN p_file_type VARCHAR(10),
    IN p_file_extension VARCHAR(10),
    IN p_file_size BIGINT,
    IN p_is_primary BOOLEAN,
    IN p_width INT,
    IN p_height INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Si es imagen principal, quitar primary de otras imágenes
    IF p_is_primary = TRUE THEN
        UPDATE vehicle_media 
        SET is_primary = FALSE 
        WHERE vehicle_id = p_vehicle_id;
    END IF;
    
    INSERT INTO vehicle_media (
        vehicle_id, file_name, file_path, file_type, file_extension,
        file_size, is_primary, width, height
    ) VALUES (
        p_vehicle_id, p_file_name, p_file_path, p_file_type, p_file_extension,
        p_file_size, p_is_primary, p_width, p_height
    );
    
    COMMIT;
END//

DELIMITER ;

-- ========================================
-- DATOS DE EJEMPLO
-- ========================================

-- Insertar usuario admin
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('angelo', 'angelo@carconnect.com', '$2b$10$example_hash', 'Angelo Admin', 'admin');

-- Insertar vehículos de ejemplo
INSERT INTO vehicles (make, model, year, price, mileage, fuel_type, transmission, description, vehicle_type, condition_type, price_type, is_featured) VALUES
('Toyota', 'Camry', 2022, 150000.00, 20, 'Gasolina', 'Automatico', 'Asientos de cuero motor v4 bla bla bla', 'Sedan', 'Usado', 'Contado', TRUE),
('Toyota', 'Camry', 2021, 150000.00, 20, 'Diesel', 'Automatico', 'Asientos de cuero motor v4 bla bla bla', 'Sedan', 'Usado', 'Financiado', TRUE),
('Mercedes Benz', 'G-Class', 2022, 150000.00, 20, 'Diesel', 'Automatico', 'Asientos de cuero motor v4 bla bla bla', 'SUV', 'Usado', 'Contado', TRUE),
('Toyota', 'Hilux', 2020, 150000.00, 20, 'Gasolina', 'Automatico', 'Asientos de cuero motor v4 bla bla bla', 'Pickup', 'Usado', 'Financiado', TRUE);

-- Insertar características de ejemplo
INSERT INTO vehicle_features (vehicle_id, category, feature_name) VALUES
(1, 'interior', 'Asientos de cuero'),
(1, 'motor', 'Motor V4'),
(1, 'seguridad', 'Aire acondicionado'),
(2, 'interior', 'Asientos de cuero'),
(2, 'motor', 'Motor V4'),
(2, 'tecnologia', 'Sistema de navegación');

-- Insertar datos administrativos de ejemplo
INSERT INTO vehicle_admin_data (vehicle_id, fecha_llegada_honduras, fecha_salida_eeuu, estado_compra_eeuu, pagina_web_compra, costo_chocado, costo_venta_chocado, costo_venta_reparado) VALUES
(1, '2024-01-15', '2024-01-01', 'California', 'Copart', 5000.00, 120000.00, 150000.00),
(2, '2024-01-20', '2024-01-05', 'Texas', 'IAAI', 4500.00, 115000.00, 150000.00);

-- ========================================
-- CONSULTAS ÚTILES DE EJEMPLO
-- ========================================

-- Buscar vehículos por texto
-- SELECT * FROM vehicles WHERE make LIKE '%Toyota%' OR model LIKE '%Camry%' OR description LIKE '%cuero%';

-- Obtener vehículo con todas sus imágenes
-- SELECT v.*, vm.file_path, vm.file_type, vm.is_primary 
-- FROM vehicles v 
-- LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id 
-- WHERE v.id = 1 
-- ORDER BY vm.is_primary DESC, vm.display_order;

-- Obtener vehículos destacados con imagen principal
-- SELECT v.*, vm.file_path as primary_image 
-- FROM vehicles v 
-- LEFT JOIN vehicle_media vm ON v.id = vm.vehicle_id AND vm.is_primary = TRUE 
-- WHERE v.is_featured = TRUE AND v.is_visible = TRUE;

-- Buscar por rango de precios
-- SELECT * FROM vehicles WHERE price BETWEEN 100000 AND 200000 AND is_visible = TRUE;

-- Obtener estadísticas de vehículos
-- SELECT 
--     vehicle_type,
--     COUNT(*) as total,
--     AVG(price) as precio_promedio,
--     MIN(price) as precio_minimo,
--     MAX(price) as precio_maximo
-- FROM vehicles 
-- WHERE is_visible = TRUE 
-- GROUP BY vehicle_type;
