require('dotenv').config()
var jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User.model');

const authorizeVender = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
        if(err) 
            res.status('401').send({msg : "Not authorized"});
        else {
            const user = await UserModel.findOne({_id : decoded.userId});
            if(user?.role !== "vender")
                res.status('401').send({msg : "Not authorized"});
            req.userId = decoded.userId;
            next();
        }
    });
}

module.exports = {
    authorizeVender
}