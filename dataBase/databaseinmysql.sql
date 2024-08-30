CREATE DATABASE `Jogo` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;
USE `Jogo`;

CREATE TABLE TblUsuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) UNIQUE,
    gmail VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto_de_perfil MEDIUMTEXT
);

-- Tabela TblFuncionario
CREATE TABLE TblFuncionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario)
);

-- Tabela TblBanimentos
CREATE TABLE TblBanimentos (
    id_Banimentos INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_administrador INT NOT NULL,
    motivo VARCHAR(250),
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario),
    FOREIGN KEY (id_administrador) REFERENCES TblFuncionario(id_funcionario)
);

-- Tabela TblMissoes
CREATE TABLE TblMissoes (
    id_missoes INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    descricao VARCHAR(250) NOT NULL,
    desafio INT NOT NULL
);

-- Inserção de dados em TblMissoes
INSERT INTO TblMissoes(nome, categoria, descricao, desafio)
VALUES 
    ('Um bixo entrosa', 'Popularidade', 'Apos a sua chegada, voce deve ter percebido que nao tem amigos nessa nova escola. Entao ande por ai e faca um amigo', 1),
    ('Rockstar', 'Popularidade', 'Tocar no sarau com os seus amigos', 5);

-- Tabela TblProgresso
CREATE TABLE TblProgresso (
    id_missoes INT NOT NULL,
    id_usuario INT NOT NULL,
    progresso INT,
    FOREIGN KEY (id_missoes) REFERENCES TblMissoes(id_missoes),
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario)
);

-- Tabela TblPost
CREATE TABLE TblPost (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    curtidas INT DEFAULT 0,
    mensagem VARCHAR(250),
    imagem mediumtext DEFAULT NULL,
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario)
);

-- Tabela TblComentario
CREATE TABLE TblComentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_post INT NOT NULL,
    curtidas INT DEFAULT 0,
    mensagem VARCHAR(250),
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario),
    FOREIGN KEY (id_post) REFERENCES TblPost(id_post)
);

-- Tabela TblCurtida_post
CREATE TABLE TblCurtida_post (
    id_post INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario),
    FOREIGN KEY (id_post) REFERENCES TblPost(id_post),
    PRIMARY KEY (id_post, id_usuario)  -- Composição da chave primária
);

-- Tabela TblCurtida_comentario
CREATE TABLE TblCurtida_comentario (
    id_comentario INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES TblUsuario(id_usuario),
    FOREIGN KEY (id_comentario) REFERENCES TblComentario(id_comentario),
    PRIMARY KEY (id_comentario, id_usuario)  -- Composição da chave primária
);
