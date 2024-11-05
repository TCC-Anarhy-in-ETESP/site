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

module.exports = router;