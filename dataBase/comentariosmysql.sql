-- Send Post--------------------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE FUNCTION sendpost(
    p_id_usuario INT,
    p_mensagem VARCHAR(250),
    p_imagem MEDIUMTEXT
) 
RETURNS INT
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    INSERT INTO TblPost (id_usuario, curtidas, mensagem, imagem)
    VALUES (p_id_usuario, 0, p_mensagem, p_imagem);
    RETURN LAST_INSERT_ID(); -- Retorna o ID do post inserido
END //

DELIMITER ;


SELECT  sendpost(6, 'Senhores, com muito pesar eu tenho que avisar que não irei dar mais aulas para vcz KSJKSKSKKSKKS', null);

select * from tblcurtida_post

-- Send Coment------------------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE FUNCTION sendcomment(
    p_id_post INT,
    p_id_usuario INT,
    p_mensagem VARCHAR(250)
) 
RETURNS INT
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    INSERT INTO TblComentario (id_post, id_usuario, mensagem, curtidas)
    VALUES (p_id_post, p_id_usuario, p_mensagem, 0);
    RETURN LAST_INSERT_ID(); -- Retorna o ID do comentário inserido
END //

DELIMITER ;

select sendcomment(1, 6, 'bombom', null)

select * from tblcomentario

-- Register Dislike Post--------------------------------------------------------------------------------------------------------
	DELIMITER //

	CREATE PROCEDURE registerdislikepost(
		IN p_id_usuario INT,
		IN p_id_post INT
	)
	BEGIN
		DECLARE v_likes_count INT DEFAULT 0;

		-- Verifica se o usuário deu like no post
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM TblCurtida_post
		WHERE id_post = p_id_post AND id_usuario = p_id_usuario;

		-- Se o usuário não deu like, gera uma exceção
		IF v_likes_count < 1 THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario nao deu like';
		END IF;

		-- Remove o like do post
		DELETE FROM TblCurtida_post
		WHERE id_post = p_id_post AND id_usuario = p_id_usuario;

		-- Conta o total de curtidas no post e atualiza
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM TblCurtida_post
		WHERE id_post = p_id_post;

		UPDATE TblPost SET curtidas = v_likes_count
		WHERE id_post = p_id_post;

		-- Retorna os resultados usando a procedure refrashlikepost
		CALL refrashlikepost(p_id_usuario, p_id_post);

	END //

	DELIMITER ;
    
    call registerdislikepost(1, 1)
    
-- Register Dislike Comment-----------------------------------------------------------------------------------------------------
	DELIMITER //

	CREATE PROCEDURE registerdislikecomment(
		IN p_id_usuario INT,
		IN p_id_comentario INT
	)
	BEGIN
		DECLARE v_likes_count INT DEFAULT 0;

		-- Verifica se o usuário deu like no comentário
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM tblcurtida_comentario
		WHERE id_comentario = p_id_comentario AND id_usuario = p_id_usuario;

		-- Se o usuário não deu like, gera uma exceção
		IF v_likes_count < 1 THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario nao deu like';
		END IF;

		-- Remove o like do comentário
		DELETE FROM tblcurtida_comentario
		WHERE id_comentario = p_id_comentario AND id_usuario = p_id_usuario;

		-- Conta o total de curtidas no comentário e atualiza
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM tblcurtida_comentario
		WHERE id_comentario = p_id_comentario;

		UPDATE tblcomentario SET curtidas = v_likes_count
		WHERE id_comentario = p_id_comentario;

		-- Retorna os resultados usando a procedure refrashlikecomment
		CALL refrashlikecomment(p_id_usuario, p_id_comentario);

	END //

	DELIMITER ;

CALL registerdislikecomment(6, 1);

drop procedure registerdislikecomment;


select * from TblCurtida_comentario
select * from TblUsuario

-- Register like Post-----------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE registerlikepost(
    IN p_id_usuario INT,
    IN p_id_post INT
)
BEGIN
    DECLARE v_likes_count INT;

    -- Verifica se o usuário já deu like no post
    SELECT COUNT(id_usuario) INTO v_likes_count
    FROM TblCurtida_post
    WHERE id_post = p_id_post AND id_usuario = p_id_usuario;

    -- Se o usuário já deu like, gera uma exceção
    IF v_likes_count >= 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario ja deu like';
    END IF;

    -- Insere o like para o post
    INSERT INTO TblCurtida_post (id_post, id_usuario) VALUES (p_id_post, p_id_usuario);

    -- Atualiza o total de curtidas no post
    SELECT COUNT(id_usuario) INTO v_likes_count
    FROM TblCurtida_post
    WHERE id_post = p_id_post;

    UPDATE TblPost SET curtidas = v_likes_count
    WHERE id_post = p_id_post;

    -- Retorna os resultados usando a procedure refrashlikepost
    CALL refrashlikepost(p_id_usuario, p_id_post);

END //

DELIMITER ;

drop procedure registerlikepost;

CALL registerlikepost(1, 1);

select * from Tblpost

-- Register Like Comment-----------------------------------------------------------------------------------------------------
DELIMITER //

	CREATE PROCEDURE registerlikecomment(
		IN p_id_usuario INT,
		IN p_id_comentario INT
	)
	BEGIN
		DECLARE v_likes_count INT;

		-- Verifica se o usuário já deu like no comentário
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM tblcurtida_comentario
		WHERE id_comentario = p_id_comentario AND id_usuario = p_id_usuario;

		-- Se o usuário já deu like, gera uma exceção
		IF v_likes_count >= 1 THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario ja deu like';
		END IF;

		-- Insere o like para o comentário
		INSERT INTO tblcurtida_comentario (id_comentario, id_usuario) VALUES (p_id_comentario, p_id_usuario);

		-- Conta o total de curtidas no comentário e atualiza
		SELECT COUNT(id_usuario) INTO v_likes_count
		FROM tblcurtida_comentario
		WHERE id_comentario = p_id_comentario;

		UPDATE tblcomentario SET curtidas = v_likes_count
		WHERE id_comentario = p_id_comentario;

		-- Retorna os resultados usando a procedure refrashlikecomment
		CALL refrashlikecomment(p_id_usuario, p_id_comentario);

	END //

	DELIMITER ;
    
    call registerlikecomment(2, 1 );

-- Refrash Like Post------------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE refrashlikepost(
    IN p_id_usuario INT,
    IN p_id_post INT
)
BEGIN
    -- Verifica se o usuário já deu like no post e conta o total de curtidas
    SELECT 
        (SELECT COUNT(id_usuario) 
         FROM TblCurtida_post 
         WHERE id_post = p_id_post) AS p_curtidas,
        IF(
            (SELECT COUNT(id_usuario) 
             FROM TblCurtida_post 
             WHERE id_usuario = p_id_usuario AND id_post = p_id_post) >= 1, 
            'TRUE', 
            'FALSE'
        ) AS p_liked;
END //

DELIMITER ;

CALL refrashlikepost(6, 1)



-- Refrash Like Comment-----------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE refrashlikecomment(
    IN p_id_usuario INT,
    IN p_id_comentario INT
)
BEGIN
    -- Conta o total de curtidas para o comentário e retorna o resultado
    SELECT 
        (SELECT COUNT(id_usuario) 
         FROM tblcurtida_comentario 
         WHERE id_comentario = p_id_comentario) AS p_curtidas,
        IF(
            (SELECT COUNT(id_usuario) 
             FROM TblCurtida_comentario 
             WHERE id_usuario = p_id_usuario AND id_comentario = p_id_comentario) >= 1, 
            'TRUE', 
            'FALSE'
        ) AS p_liked;
END //

DELIMITER ;

drop procedure refrashlikecomment

CALL refrashlikecomment(6, 1);


-- Get posts--------------------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE getposts()
BEGIN
    -- Retorna os dados dos posts com detalhes do usuário
    SELECT 
        tblpost.id_post AS p_id_post,
        tblusuario.nome AS p_nome,
        tblusuario.foto_de_perfil AS p_foto_de_perfil,
        tblpost.mensagem AS p_mensagem,
        tblpost.imagem AS p_imagem,
        tblpost.curtidas AS p_curtidas
    FROM 
        tblpost
    JOIN 
        tblusuario ON tblpost.id_usuario = tblusuario.id_usuario;
END //

DELIMITER ;

call getposts



-- Get Posts Logged-------------------------------------------------------------------------------------------------------------
	DELIMITER //

	CREATE PROCEDURE getpostsloged(
		IN p_id_usuario INT
	)
	BEGIN
		-- Declara variáveis para armazenar curtidas e status de like
		DECLARE v_curtidas INT;
		DECLARE v_liked CHAR(5);

		-- Seleciona os dados dos posts junto com informações do usuário
		-- e calcula curtidas e status de like para cada post
		CREATE TEMPORARY TABLE temp_posts AS
		SELECT 
			tblpost.id_post,
			tblusuario.nome,
			tblusuario.foto_de_perfil,
			tblpost.mensagem,
			tblpost.imagem
		FROM 
			tblpost
		JOIN 
			tblusuario ON tblpost.id_usuario = tblusuario.id_usuario;

		-- Preenche a tabela temporária com curtidas e status de like
		SELECT 
			temp_posts.id_post as p_id_post,
			temp_posts.nome as p_nome,
			temp_posts.foto_de_perfil as p_foto_de_perfil,
			temp_posts.mensagem as p_mensagem,
			temp_posts.imagem as p_imagem,
			(SELECT COUNT(*) 
			 FROM TblCurtida_post 
			 WHERE id_post = temp_posts.id_post) AS p_curtidas,
			(SELECT IF(COUNT(id_usuario) >= 1, 'TRUE', 'FALSE')
			 FROM TblCurtida_post 
			 WHERE id_post = temp_posts.id_post AND id_usuario = p_id_usuario) AS p_liked
		FROM 
			temp_posts;

		-- Drop the temporary table
		DROP TEMPORARY TABLE IF EXISTS temp_posts;

		END //

	DELIMITER ;
    
    call getpostsloged(2)

	drop procedure getpostsloged

-- Get Post By User-------------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE getpostsbyuser(
    IN id_user INT
)
BEGIN
    -- Retorna os posts de um usuário específico com detalhes do usuário
    SELECT 
        tblpost.id_post AS p_id_post,
        tblusuario.nome AS p_nome,
        tblusuario.foto_de_perfil AS p_foto_de_perfil,
        tblpost.mensagem AS p_mensagem,
        tblpost.imagem AS p_imagem,
        tblpost.curtidas AS p_curtidas
    FROM 
        tblpost
    JOIN 
        tblusuario ON tblpost.id_usuario = tblusuario.id_usuario
    WHERE 
        tblusuario.id_usuario = id_user;
END //

DELIMITER ;

call getpostsbyuser(6)



-- Get Comments By Posts--------------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE getcommentsbypost(
    IN v_id_post INT
)
BEGIN
    -- Retorna os comentários de um post específico com detalhes do usuário
    SELECT 
        tblusuario.nome AS p_nome,
        tblusuario.foto_de_perfil AS p_foto_de_perfil,
        tblcomentario.mensagem AS p_mensagem,
        tblcomentario.curtidas AS p_curtidas
    FROM 
        tblcomentario
    JOIN 
        tblusuario ON tblcomentario.id_usuario = tblusuario.id_usuario
    WHERE 
        tblcomentario.id_post = v_id_post;
END //

DELIMITER ;

call getcommentsbypost(1)


-- Get Comments By Post Logged-----------------------------------------------------------------------------------------------------
DELIMITER //

CREATE PROCEDURE getcommentsbypostloged(
    IN p_id_usuario INT,
    IN p_id_post INT
)
BEGIN
    -- Declara variáveis para armazenar curtidas e status de like
    DECLARE v_curtidas INT;
    DECLARE v_liked CHAR(5);
    
-- Seleciona os comentários do post específico
   
    SELECT 
        tblcomentario.id_comentario AS p_id_comentario,
        tblusuario.nome AS p_nome,
        tblusuario.foto_de_perfil AS p_foto_de_perfil,
        tblcomentario.mensagem AS p_mensagem,
        (SELECT COUNT(*) 
         FROM tblcurtida_comentario 
         WHERE id_comentario = tblcomentario.id_comentario) AS p_curtidas,
        (SELECT IF(COUNT(id_usuario) >= 1, 'TRUE', 'FALSE')
         FROM tblcurtida_comentario
		 where tblcurtida_comentario.id_comentario = tblcomentario.id_comentario and tblcurtida_comentario.id_usuario = p_id_usuario) as p_liked
    FROM 
        tblcomentario
    JOIN 
        tblusuario ON tblcomentario.id_usuario = tblusuario.id_usuario
    WHERE 
        tblcomentario.id_post = p_id_post;

END //

DELIMITER ;



