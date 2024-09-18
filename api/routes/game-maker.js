const express = require("express");
const router = express.Router();
const db = require("../postgre-con");
const auth = require("../auth");
const authPass = require("../authPass");

router.get("/conquista/:playerid-:conquistaid-:num", async (req, res)=>{
    const {playerid, conquistaid, num} = req.params;
    const userid = parseInt(playerid);
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

module.exports = router;