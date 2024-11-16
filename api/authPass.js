const jwt = require('jsonwebtoken');
const SECRET = 'nicolas';

module.exports = (req, res, next)=>{

    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                errors: 'Invalid or expired token'
            });
        }

        req.userid = decoded.userid;
        next();
    });
 }