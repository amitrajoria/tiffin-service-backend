const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorizeVender } = require("../middlewares/authorizeVender");
const { TiffinModel } = require("../models/Tiffin.module");

const TiffinController = Router();

const validateTiffin = (req, res, next) => {
    const {title, description, time, price} = req.body;
    if(title?.trim() && description?.trim() && time?.trim() && price?.trim())
        next();
    else 
        res.status("401").send({msg : "All fields are required"});
}


TiffinController.get('/:vender_id', authenticate, async (req, res) => {
    const userId = req.userId;
    const vender_id = req.params.vender_id;
    const tiffin = await TiffinModel.find({vender_id}).sort( { createdAt : -1 } );
    res.status('200').send({tiffin});
})

TiffinController.post('/add/:vender_id', authorizeVender, validateTiffin, async (req, res) => {
    const payload = {
        ...req.body,
        vender_id : req.params.vender_id
    }
    const tiffin = new TiffinModel(payload);
    await tiffin.save();
    res.status("201").send({msg : 'Tiffin Added Successfully'});
})

TiffinController.patch('/update', authorizeVender, async (req, res) => {
    const {id, status} = req.body;
    console.log(req.body);
    const tiffin = await TiffinModel.findOneAndUpdate({_id: id}, {status}, {new: true});
    if(tiffin)
        res.status("201").send({msg : 'Status Updated Successfully'});
    else 
        res.status("400").send({msg : 'Something went wrong'});
})

module.exports = {
    TiffinController
}