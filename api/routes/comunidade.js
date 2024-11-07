const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");
const authPass = require("../authPass");

router.post('/post-post', auth, async (req, res) =>{
    const {mensagem, imagem} = req.body;
    
    try{

<<<<<<< HEAD
        db("call sendpost(?, ?, ?)", [req.userid, mensagem, imagem]);
=======
        await db("call sendpost(?, ?, ?)", [req.userid, mensagem, imagem]);
        
>>>>>>> alteracoes
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
    const {id_post, mensagem} = req.body;
    console.log(req)
    
    try{

<<<<<<< HEAD
        db("call sendcomment(?, ?, ?)", [id_post, req.userid, mensagem]);
=======
        await db("call sendcomment(?, ?, ?)", [id_post, req.userid, mensagem]);
>>>>>>> alteracoes
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
            
            const [res_posts] = await db("call getposts");

            var datas = []; 

            for(i = 0; i < res_posts.length; i++){
                const {p_id_post} = res_posts[i];
                
                const [res_comments] = await db("call getcommentsbypost(?)", p_id_post);
            
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
            
            const [res_posts] = await db("call getpostsloged(?)", req.userid);

            var datas = []; 



            for(i = 0; i < res_posts.length; i++){
                const {p_id_post} = res_posts[i];
                console.log(res_posts[i])
                const [res_comments] = await db("call getcommentsbypostloged(?, ?)", [req.userid, p_id_post]);

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

router.get("/get-posts-with-comments-user", auth, async (req, res) => {
        try{
            const resposta = await db("call getpostsbyuser(?)", req.userid);

            if(resposta.sqlMessage == "vazio"){
                res.status(200).json({
                    post_comments: "vazio", 
                });
                return;
            }

            var datas = []; 

            const [res_posts] = resposta;

            for(i = 0; i < res_posts.length; i++){
                const {p_id_post} = res_posts[i];
                console.log(res_posts[i])
                const [res_comments] = await db("call getcommentsbypostloged(?, ?)", [req.userid, p_id_post]);

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
    
});

router.get("/get-posts-with-comments-user-respostas", auth, async (req, res) => {
    try{
        const resposta = await db("call sp_getpostbycommentid(?)", req.userid);

        if(resposta.sqlMessage == "vazio"){
            res.status(200).json({
                post_comments: "vazio", 
            });
            return;
        }

        var datas = []; 

        const [res_posts] = resposta;

        for(i = 0; i < res_posts.length; i++){
            const {p_id_post} = res_posts[i];
            console.log(res_posts[i])
            const [res_comments] = await db("call getcommentsbypostloged(?, ?)", [req.userid, p_id_post]);

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

});

router.post("/like-post", auth, async(req, res) => {
    const {id_post} = req.body;
    try{
        const resultado = await db("CALL registerlikepost(?, ?);", [req.userid, id_post]);
        try{
            const returning = resultado[0];
            res.status(200).json({
                resultado: returning[0]
            });
        }catch{
            const returning = -1;
            res.status(200).json({
                resultado: returning
            });
        }
        
    }catch{
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });   
    }
});

router.post("/dislike-post", auth, async(req, res) => {
    const {id_post} = req.body;
    try{
        const resultado = await db("CALL registerdislikepost(?, ?)", [req.userid, id_post]);
        try{
            const returning = resultado[0];
            res.status(200).json({
                resultado: returning[0]
            });
        }catch{
            const returning = -1;
            res.status(200).json({
                resultado: returning
            });
        }
        
    }catch{
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });   
    }
});



router.post("/like-comment", auth, async(req, res) => {
    const {id_post} = req.body;
    try{
        const resultado = await db("CALL registerlikecomment(?, ?);", [req.userid, id_post]);
        try{
            const returning = resultado[0];
            res.status(200).json({
                resultado: returning[0]
            });
        }catch{
            const returning = -1;
            res.status(200).json({
                resultado: returning
            });
        }
        
    }catch{
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });   
    }
});

router.post("/dislike-comment", auth, async(req, res) => {
    const {id_post} = req.body;
    try{
        const resultado = await db("CALL registerdislikecomment(?, ?);", [req.userid, id_post]);
        try{
            const returning = resultado[0];
            res.status(200).json({
                resultado: returning[0]
            });
        }catch{
            const returning = -1;
            res.status(200).json({
                resultado: returning
            });
        }
        
    }catch{
        res.status(404).json({
            mensagem: "Erro, talvez o banco de dados esteja fora do ar.",
            erros: err
        });   
    }
});

router.delete("/deletar-post", auth, async (req, res)=>{
    const {id_post} = req.body;
    try{
        await db("call sp_excluirpost(?);", [id_post]);
        res.status(200).json({
            resposta : "post deletado"
        })
    }catch(err){
        res.status(200).json({
            resposta : "post não deletado",
            err : err
        })
    }
});

router.delete("/deletar-comentario", auth, async (req, res)=>{
    const {id_comentario} = req.body;
    try{
        await db("call sp_excluircomment(?);", [id_comentario]);
        res.status(200).json({
            resposta : "comentario deletado"
        })
    }catch(err){
        res.status(200).json({
            resposta : "comentario não deletado",
            err : err
        })
    }
});

module.exports = router;