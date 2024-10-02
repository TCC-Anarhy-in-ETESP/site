const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");
const authPass = require("../authPass");

router.patch("/conquista/atualizar", auth, async (req, res)=>{
    const {playerid, conquistaid, num} = req.body;
    const userid = req.userid;
    const missoesid = parseInt(conquistaid);
    const numero = parseInt(num);
    
    try{
        const [resposta] = await db(`call sp_update_conquista(?, ?, ?)`, [missoesid, userid, numero]);
        res.status(200).json({
            resposta : resposta[0]
        });
    }catch(err){

    };
    
    
});

router.get("/conquista/pegar", auth, async (req, res)=>{
    const userid = req.userid;
    try{
        const [resposta] = await db(`call sp_getprogresso(?)`, [userid]);
        const [respos] = resposta
        res.status(200).json({
            resposta : resposta
        });
    }catch(err){
    };
});

module.exports = router;