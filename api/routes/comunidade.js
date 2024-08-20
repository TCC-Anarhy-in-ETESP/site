const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");
const authPass = require("../authPass");

router.post('/post-post', auth, async (req, res) =>{
    const {mensagem, imagem} = req.body;
    
    try{

        db.query("select sendpost($1, $2, $3)", [req.userid, mensagem, imagem]);
        res.status(200).json({
            mensagem: "Post colocado na comunidade com sucesso",
        });

    }catch(err){
        res.status(500).json({
            mensagem: "Erro ao enviar a mensagem para o banco de dados",
            erro: err
        });
    }
});


router.post("/post-comment", auth, async (req, res) => {
    const {id_post, mensagem, imagem} = req.body;
    
    try{

        db.query("select sendcomment($1, $2, $3, $4)", [id_post, req.userid, mensagem, imagem]);
        res.status(200).json({
            mensagem: "comentario colocado na comunidade com sucesso"
        });

    }catch(err){
        res.status(500).json({
            mensagem: "Erro ao enviar a mensagem para o banco de dados",
            erro: err
        });
    }
});

router.get("/get-posts-with-comments", authPass, async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        try{
            
            const res_posts = await db.query("select * from getposts()");

            var datas = []; 

            for(i = 0; i < res_posts.length; i++){
                const {p_id_post} = res_posts[i];
                const res_comments = await db.query("select * from getcommentsbypost($1)", p_id_post);
            
                const data = {
                    post_comments : {
                        post: await res_posts[i],
                        comments: await res_comments
                    }
                }

                datas.push(data)
            }
            
            res.status(200).json({
                mensagem: "Todos os posts pegos com sucesso.",
                resultados: datas
            });
            
        }catch(err){
            res.status(404).json({
                mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
                erros: err
            });    
        }
    }else{
        try{
            
            const res_posts = await db.query("select * from getpostsloged($1)", req.userid);

            var datas = []; 

            for(i = 0; i < res_posts.length; i++){
                const {p_id_post} = res_posts[i];
                const res_comments = await db.query("select * from getcommentsbypostloged($1, $2)", [req.userid, p_id_post]);
            
                const data = {
                    post_comments : {
                        post: await res_posts[i],
                        comments: await res_comments
                    }
                }

                datas.push(data)
            }
            
            res.status(200).json({
                mensagem: "Todos os posts pegos com sucesso.",
                resultados: datas
            });
            
        }catch(err){
            res.status(404).json({
                mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
                erros: err
            });    
        }
    }
});

router.post("/like-post", auth, async(req, res) => {
    const {id_post} = req.body;
    try{
        const resultado = await db.query("select * from registerlikepost($1, $2)", [req.userid, id_post]);
        res.status(200).json({
            resultado: resultado
        });
    }catch{
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });   
    }
});



module.exports = router;