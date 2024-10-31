const express = require("express");
const cookieParse = require("cookie-parser")
const dotenv = require("dotenv")
const app = express();

dotenv.config()


const pags = require("../pages/pags");
const usuario = require("./routes/usuario");
const comunidade = require("./routes/comunidade");
const gameMaker = require("./routes/game-maker");

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use( express.urlencoded({
    extended: true
    })
);

app.use(cookieParse())

app.use("/", pags); 

app.use("/", comunidade); 

app.use("/", usuario);

app.use("/gml", gameMaker);

app.use("/teste", (req, res)=>{
    try{
        res.status(200).send({
            message: 'hello world'
        });
    }catch( err){
        res.status(500);
    };
        
});

module.exports = app;

