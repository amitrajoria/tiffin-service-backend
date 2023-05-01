const {Router} = require("express");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { UserModel } = require("../models/User.model");
require('dotenv').config()

const AuthController = Router();

const validateAuth = (req, res, next) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    if(name?.trim() && email?.trim() && password?.trim())
        next();
    else 
        res.status("401").send({msg : "All fields are required"});
}

AuthController.get("/", (req, res) => {
    res.send("Auth Page");
})

AuthController.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user)
        res.status('401').send({msg : "Invalid Creadentials"});
    else {
        bcrypt.compare(password, user?.password).then(function(result) {
            var token = jwt.sign({ userId: user._id, role : user.role }, process.env.JWT_SECRET);
            if(!result)
                res.status('401').send({msg : "Invalid Creadentials"});
            else 
                res.status('200').send({msg : "LoggedIn Successfull", token : token});
        });
    }
})

AuthController.post("/register", validateAuth, (req, res) => {
    const {name, email, password, vender_id} = req.body;
    bcrypt.hash(password, 8).then(async function(hash) {
        const user = new UserModel({name, email, password:hash, vender_id});
        await user.save();
        res.status('201').send({msg: "Signup Successfull"});
    });
})


module.exports = {
    AuthController
}