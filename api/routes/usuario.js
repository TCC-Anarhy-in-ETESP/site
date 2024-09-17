const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../postgre-con");
const jwt = require('jsonwebtoken');
const auth = require("../auth");
const SECRET = 'nicolas';
const path = require('path');
const nodemailer = require('nodemailer');
const { error } = require("console");

// Endpoint de login
router.post('/get-login', async function(req, res) {
    const {email, password} = req.body;
    console.log("email: "+ email);
    console.log("password: "+password);
   

    try {
        const usuario = await db(`select id_usuario as id, gmail as gmailbd, senha as senhabd from TblUsuario where gmail like ?`, [email]);
        let result = false;
        
        try{
            result = await bcrypt.compare(password, usuario[0].senhabd);
        }catch{
            console.log("erro")
            res.status(400).json({
                resultado : "erro"
            });
            return;
        }
        
        const id = usuario[0].id;

        if(result){
            const token = jwt.sign({userid: id}, SECRET);
            res.cookie("token", token, {httpOnly: true}).json({
                resultado : "logado"
            });
            
        } else{
            console.log("erro")
            res.status(400).json({
                resultado : "erro"
            });
        }

        

    }catch(err){
        return console.log("merda", err);
        
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires:new Date("December 17, 1995 03:24:00") }).json({ resultado: 'logout bem-sucedido' });
});


router.post('/post-signin', async function(req, res) {
    const { username, email,  password, imagem } = req.body;
    const passwordHash = await bcrypt.hash(password, 8);
    
    try {
        const resultado = await db(`CALL sp_signin(?, ?, ?, ?);`, [username, email, passwordHash, imagem]);
        if(resultado.sqlMessage == "nome"){
            res.status(200).json({
                resultado : "nome"
            });
            return;
        }else if(resultado.sqlMessage == "gmail"){
            res.status(200).json({
                resultado : "gmail"
            });
            return;
        } 
        res.status(200).json({
            resultado : "Usuario cadastrado"
        })
        
    }catch(err){
        res.status(404).send("falha de comunicação com o banco de dados \n erro: ", err);
    }
});

router.get("/get-usuario", auth,  async function (req, res){

    try{
        const id = req.userid;
        const usuario = await db(`select id_usuario, nome, foto_de_perfil from TblUsuario where id_usuario = ?`, [id]);
        res.send(usuario)
    }catch(err){
        res.status(404).send("usuario nao encontrado", err);
    }
});

router.patch("/patch-usuario", auth, async function (req, res){
    const {username, email, password, imagem } = req.body;
    const id = req.userid;
    console.log("ate aqui foi")

    try{
        const usuario = await db(`call sp_atualizar(?, ?, ?, ?, ?);`, [id, username, email, password, imagem]);
        res.status(200).json({
            resultado : "Usuario atualizado"
        });
    }catch(err){
        res.status(500).json({
            resultado : "erro"
        });
    }
});


router.post("/excluir-conta", auth, async (req, res)=>{
    try{
        const usario = req.userid;
        const [resposta] = await db(`call sp_excluir(?)`, usario);
        const {excluido} = resposta[0];
        if(excluido == "excluido"){
            res.status(200).json({
                resposta : "usuario excluido"
            });
        }
        
        throw new Error("usuario não foi excluido");
        
    }catch(err){    
        res.status(500).json({
            resposta: "erro", erro: err
        });
    }
    
})

router.post("/sendemail", (req, res) =>{
    const {email} = req.body;
    console.log(email)
    const codigo = Math.floor(Math.random() * 999999)
    try{
        const transport = nodemailer.createTransport({
            host: 'smtp.mailersend.net',
            port: 587,
            secure: false,
            auth:{
                user: 'MS_DirzBk@trial-7dnvo4dvjrx45r86.mlsender.net',
                pass: '9hjlOBepMiQ77GZq'
            }
        });
    
        transport.sendMail({
            from: "ETESP Invasion <MS_DirzBk@trial-7dnvo4dvjrx45r86.mlsender.net>",
            to: email,
            subject: 'CONFIRMAÇÃO DO EMAIL ANARCHY IN ETESP',
            html: `<h1>Hello world</h1><br><p>O codigo de verificação é: ${codigo}</p>`
        })

        res.status(200).json({
            codigo: codigo
        });
    }catch(err){
       res.status(500).json({
            codigo: 'erro',
            erro: err
       });
    }
});

router.get("/sendemail-logged", auth, async (req, res) =>{
    try{
        const user = req.userid;
        const resposta = await db(`call sp_getuser(?);`, [user]);
        const [{gmail}] = resposta[0];

        const codigo = Math.floor(Math.random() * 999999)

        const transport = nodemailer.createTransport({
            host: 'smtp.mailersend.net',
            port: 587,
            secure: false,
            auth:{
                user: 'MS_DirzBk@trial-7dnvo4dvjrx45r86.mlsender.net',
                pass: '9hjlOBepMiQ77GZq'
            }
        });
    
        transport.sendMail({
            from: "ETESP Invasion <MS_DirzBk@trial-7dnvo4dvjrx45r86.mlsender.net>",
            to: gmail,
            subject: 'CONFIRMAÇÃO DO EMAIL ANARCHY IN ETESP',
            html: `<h1>Hello world</h1><br><p>O codigo de verificação é: ${codigo}</p>`
        });

        res.status(200).json({
            codigo: codigo
        });
    }catch(err){
        res.status(500).json({
            codigo: 'erro',
            erro: err
       });
       return;
    }
});

router.post("/alterar-usuario", auth, async (req, res) => {

    const usuario = req.userid;
    const {nome, gmail, senha, foto} = req.body;
    let senhaa = senha;

    if(senha != "null"){
        senhaa = await bcrypt.hash(senha, 8);
    }


    try{
        await db(`call sp_atualizar(?, ?, ?, ?, ?)`, [usuario, nome, gmail, senhaa, foto])

        res.status(200).json({
            resposta : "usuario alterado"
        })

    }catch(err){
        res.status(500).json({
            resposta : "erro",
            erro : err
        });
    }
});

module.exports = router;