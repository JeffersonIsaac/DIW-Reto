CREATE DATABASE IF NOT EXISTS madnights_db;
USE madnights_db;

CREATE TABLE IF NOT EXISTS eventos (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       titulo VARCHAR(150) NOT NULL,
                                       categoria VARCHAR(50) NOT NULL,
                                       fecha DATE NOT NULL,
                                       ubicacion VARCHAR(100) NOT NULL,
                                       precio DECIMAL(10,2) DEFAULT 0.00,
                                       descripcion TEXT,
                                       foto1 VARCHAR(255),
                                       foto2 VARCHAR(255),
                                       foto3 VARCHAR(255)
);