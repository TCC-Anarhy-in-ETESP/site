const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");
const authPass = require("../authPass");

router.get("/get-admins", async (req, res) =>{
    try{
        const admins = await db(`call sp_getadmins()`)

        res.status(200).json({
            resposta: admins[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

router.post("/downgrade-admins", async (req, res) =>{
    try{
        const {id_admin} = req.body;

        const admin = await db(`select id_usuario as id, gmail as gmailbd, senha as senhabd from TblUsuario where id_usuario = ?`, [id_admin]);
        const nome = admin[0].gmailbd;
        const admins = await db(`call sp_downgradetouausario(?)`,[nome])

        res.status(200).json({
            resposta: admins[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

router.post("/upgrade-admins", async (req, res) =>{
    try{
        const {nome_or_gmail} = req.body;

        const admins = await db(`call sp_upgradetoadmin(?)`,[nome_or_gmail])

        res.status(200).json({
            resposta: admins[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

router.post("/ban-user", async (req, res) =>{
    try{
        const {nome_or_gmail, id_administrador, motivo} = req.body;

        const usuarios = await db(`call sp_banuser(?, ?, ?)`,[nome_or_gmail, id_administrador, motivo])

        res.status(200).json({
            resposta: usuarios[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

router.post("/unban-user", async (req, res) =>{
    try{
        const {id_usuario} = req.body
        console.log(id_usuario)
        const usuarios = await db(`call sp_unbanuser(?)`,[id_usuario])
        
        res.status(200).json({
            resposta: usuarios[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

router.get("/get-banned-users", async (req, res) =>{
    try{
        const usuarios = await db(`call sp_getbannedusers()`)

        res.status(200).json({
            resposta: usuarios[0]
        });

    }catch(err){
        res.status(401).json({
            resposta: "erro",
            erro: err
        })
    }
});

module.exports = router;