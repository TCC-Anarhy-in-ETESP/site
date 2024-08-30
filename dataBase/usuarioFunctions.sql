-- Procedure sp_signin

DELIMITER //
CREATE PROCEDURE sp_signin(
    IN sp_nome VARCHAR(255),
    IN sp_gmail VARCHAR(255),
    IN sp_senha VARCHAR(255),
    IN sp_foto_de_perfil mediumtext
)
BEGIN
    DECLARE v_userid INT;
    DECLARE v_missoescount INT DEFAULT 1;
    DECLARE v_contagem INT;
    
	IF (SELECT COUNT(id_usuario) FROM TblUsuario WHERE gmail = sp_gmail) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'gmail';
    END IF;

	IF (SELECT COUNT(id_usuario) FROM TblUsuario WHERE nome = sp_nome) > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'nome';
    END IF;

    INSERT INTO TblUsuario (nome, gmail, senha, foto_de_perfil)
    VALUES (sp_nome, sp_gmail, sp_senha, sp_foto_de_perfil);

    SELECT id_usuario INTO v_userid
    FROM TblUsuario
    WHERE gmail = sp_gmail;

    SELECT COUNT(id_missoes) INTO v_contagem
    FROM TblMissoes;

    WHILE v_missoescount <= v_contagem DO
        INSERT INTO TblProgresso (id_missoes, id_usuario, progresso)
        VALUES (v_missoescount, v_userid, 0);

        SET v_missoescount = v_missoescount + 1;
    END WHILE;
END //
DELIMITER ;

drop procedure sp_signin

CALL sp_signin('giovanna', 'nepomuceno@gmail.com', 'ag250507', null)

select * from tblusuario
-- Procedure sp_login
DELIMITER //
CREATE PROCEDURE sp_login(
    IN sp_gmail VARCHAR(255),
    IN sp_senha VARCHAR(255)
)
BEGIN
    -- Procedure logic for login (not provided in the original code)
END //
DELIMITER ;
