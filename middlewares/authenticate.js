require('dotenv').config()
var jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    // console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
        if(err) 
            res.status('401').send({msg : "Not authorized"});
        else {
            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        }
    });
}


module.exports = {
    authenticate
}