const { Router } = require("express");
const { UserModel } = require("../models/User.model");
require('dotenv').config()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { authenticate } = require("../middlewares/authenticate");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");

const VenderController = Router();


VenderController.get('/', authenticate, async (req, res) => {
    const venders = await UserModel.find({role : "vender"});
    res.status('200').send({venders});   
})

VenderController.post("/add", authorizeAdmin, async (req, res) => {
    const payload = req.body;
    const {password} = payload;
    bcrypt.hash(password, 8).then(async function(hash) {
        const newPayload = {
            ...payload,
            password : hash
        };
        const user = new UserModel(newPayload);
        await user.save();
        res.status('201').send({msg : "Vender Registered Successfully"});
    });
})

module.exports = {
    VenderController
}