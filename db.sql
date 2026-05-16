CREATE DATABASE devshowcase_db;
USE devshowcase_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    tecnologias VARCHAR(255) NOT NULL, -- Ex: "React, Node, PHP"
    categoria VARCHAR(50),
    imagem VARCHAR(255),
    link_github VARCHAR(255),
    link_demo VARCHAR(255),
    destaque BOOLEAN DEFAULT FALSE,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo um administrador padrão (Senha: admin123)
-- Hash gerado com password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO users (nome, email, senha) 
VALUES ('Admin', 'admin@devshowcase.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');