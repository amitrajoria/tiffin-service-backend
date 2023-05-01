const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { UserModel } = require("../models/User.model");

const ProfileController = Router();

ProfileController.get('/', authenticate, async (req, res) => {
    const userId = req.userId;
    const user = await UserModel.findOne({_id : userId});
    res.status('200').send({user});
})

ProfileController.patch('/update', authenticate, async (req, res) => {
    const payload = req.body;
    const userId = req.userId;
    const user = await UserModel.findOneAndUpdate({_id: userId}, payload, {new: true});
    if(user) 
        res.status('200').send({user});
    else 
        res.status('404').send({msg : "Something went wrong"});
})

module.exports = {
    ProfileController
}