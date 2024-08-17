const jwt = require('jsonwebtoken');
const { error } = require('npmlog');
const SECRET = 'nicolas';

module.exports = (req, res, next)=>{

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            errors: 'No token provided'
        });
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