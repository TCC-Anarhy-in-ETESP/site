const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../postgre-con");
const jwt = require('jsonwebtoken');
const auth = require("../auth");
const SECRET = 'nicolas';
const path = require('path');

// Configuração da conexão com o banco de dados


// Endpoint de login
router.post('/get-login', async function(req, res) {
    const {email, password} = req.body;
    

    console.log("email: "+ email);
    console.log("password: "+password);
   

    try {
        const usuario = await db.query("select id_usuario as id, gmail as gmailbd, senha as senhabd from TblUsuario where gmail like $1", [email]);
        const result = await bcrypt.compare(password, usuario[0].senhabd);
        const id = usuario[0].id;

        if(result){
            const token = jwt.sign({userid: id}, SECRET);
            res.cookie("token", token, {httpOnly: true});
            return res.redirect("/inicio")
        } else {
            
            return res.redirect("/login");
        }

        

    }catch(err){
        return console.log("merda", err);
        
    }
});




router.post('/post-signin', async function(req, res) {
    const { username, email,  password, imagem } = req.body;
    const passwordHash = await bcrypt.hash(password, 8);
    
    try {
            await db.query("CALL sp_signin($1, $2, $3, $4);", [username, email, passwordHash, imagem]).then(()=>{
           
            res.redirect("/login");
        });
        
        
    }catch(err){
        res.status(404).send("falha de comunicação com o banco de dados \n erro: ", err);
    }
});

router.get("/get-usuario", auth,  async function (req, res){
    

    try{
        const id = req.userid;
        console.log(id);
        
        const usuario = await db.query("select nome, foto_de_perfil from TblUsuario where id_usuario = $1", [id]);
        res.send(usuario)
    }catch(err){
        res.status(404).send("usuario nao encontrado", err);
    }


});

module.exports = router;