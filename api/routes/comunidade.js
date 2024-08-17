const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");

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

router.get("/get-posts", async (req, res) => {
    try{
        const resultado = await db.query("select * from getposts()")
        res.status(200).json({
            mensagem: "Todos os posts pegos com sucesso.",
            resultados: await resultado
        });
    }catch(err){
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });    
    }
});


module.exports = router;