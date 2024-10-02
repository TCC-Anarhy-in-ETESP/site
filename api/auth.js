const jwt = require('jsonwebtoken');
const { error } = require('npmlog');
const SECRET = 'nicolas';

module.exports = (req, res, next)=>{
        const {token} = req.body;

        if(token != undefined){
            console.log("token 2" + token)
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        errors: 'Invalid or expired token'
                    });
                }
                
                req.userid = decoded.userid;
                next();
            });
        }else{
            const token1 = req.cookies.token;
            console.log("token " + token)
            jwt.verify(token1, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        errors: 'Invalid or expired token'
                    });
                }
        
                req.userid = decoded.userid;
                next();
            });
        
            if(!token1){
                return res.status(401).redirect("/login")
            }
        }
        
   
        
            
        
    }
    
        
        
    
 