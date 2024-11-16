const express = require("express");
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const auth = require('../api/auth');
const auth_ban = require('../api/auth_ban');
SECRET = 'nicolas';

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
router.get('/sobre', function(req,res){
    res.sendFile(path.join(__dirname+'/sobre.html'));
});
router.get('/criaturas', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas.html'));

});
router.get('/personagens', function(req,res){
    res.sendFile(path.join(__dirname+'/personagens.html'));

});
router.get('/lugares', function(req,res){
    res.sendFile(path.join(__dirname+'/lugares.html'));

});
router.get('/criaturas/slime', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/slime.html'));

});
router.get('/criaturas/pulmb', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/plumb.html'));

});
router.get('/criaturas/purple', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/purple.html'));

});
router.get('/criaturas/mush', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/mush.html'));

});
router.get('/criaturas/frog', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/frog.html'));

});
router.get('/criaturas/white', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/white.html'));

});
router.get('/criaturas/boss', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/boss.html'));

});
router.get('/criaturas/eye', function(req,res){
    res.sendFile(path.join(__dirname+'/criaturas/eye.html'));

});
router.get('/dev', function(req,res){
    res.sendFile(path.join(__dirname+'/dev.html'));

});
router.get('/admin', function(req,res){
    res.sendFile(path.join(__dirname+'/admin.html'));

});
router.get('/viewConquista', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/conquistas.html'));

});
router.get('/viewExcluir', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/excluirConta.html'));

});
router.get('/viewVerificacao', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/verificaçãoConta.html'));

});
router.get('/viewMudarNome', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/mudarNome.html'));
});
router.get('/viewPostsUsuario', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/postsUsuario.html'));

});
router.get('/viewMudarSenha', function(req,res){
    res.sendFile(path.join(__dirname+'/usuarioView/mudarSenha.html'));

});
router.get('/comunidade', auth, auth_ban, function(req,res){
    res.sendFile(path.join(__dirname+'/comunidade.html'));

});
router.get('/forum', auth, function(req,res){
    res.sendFile(path.join(__dirname+'/forum.html'));

});
router.get('/esqueceu', function(req,res){
    res.sendFile(path.join(__dirname+'/esqueceu.html'));

});
router.get('/criar', function(req,res){
    res.sendFile(path.join(__dirname+'/criar.html'));

});
router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});
router.get('/conta', function(req, res){
    res.sendFile(path.join(__dirname + '/usuario.html'))
});


module.exports = router;