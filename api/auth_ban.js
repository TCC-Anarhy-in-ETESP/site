const jwt = require('jsonwebtoken');
const { error } = require('npmlog');
const SECRET = 'nicolas';

module.exports = (req, res, next)=>{
        
        const token1 = req.cookies.token;
        console.log("token " + token1)
        jwt.verify(token1, SECRET, (err, decoded) => {
            if (err) {
                console.log("deslogado")
                next();
            }else{
                const ban = decoded.banned;
                if(ban > 0){
                    return res.status(200).json({
                        aviso: 'usuario banido da aba comunidade'
                    });
                }
                next();
            }
            
        });
        
        
    }
    
        
        
    
 