const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { CartModel } = require("../models/Cart.module");

const CartController = Router();

CartController.get('/:venderId', authenticate, async (req, res) => {
    const user_id = req.userId;
    const vender_id = req.params.venderId;
    const cart = await CartModel.aggregate([{$match : {user_id, vender_id}}, {$lookup: {
        from: "tiffins",
        localField: "tiffin_id",
        foreignField: "_id",
        as: "tiffin"
    }} ]);
    res.status('200').send({cart});
})

CartController.post('/add', authenticate, async (req, res) => {
    const user_id = req.userId;
    const payload = {
        ...req.body ,
        user_id
    }
    const order = new CartModel(payload);
    await order.save();
    res.status('201').send({msg : "Added to Cart"});
})

CartController.delete('/delete/:cart_id', authenticate, async (req, res) => {
    const user_id = req.userId;
    const cart_id = req.params.cart_id;
    const isDeleted =  await CartModel.findByIdAndDelete({_id : cart_id , user_id});
    if(isDeleted)
        res.status('200').send({msg : "Item Deleted"});
    else 
        res.status('404').send({msg : "Item not found"});
})

module.exports = {
    CartController
}