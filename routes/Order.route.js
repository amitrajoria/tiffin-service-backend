const { Router } = require("express");
const { mongoose } = require("mongoose");
const { authenticate } = require("../middlewares/authenticate");
const { CartModel } = require("../models/Cart.module");
const { OrderModel } = require("../models/Order.module");
const { OrderRelationModel } = require("../models/Order_relation.module");

const OrderController = Router();

const makeDate = (req) => {
    let createdAt={};
    if(req.query.startDate !== undefined && req.query.endDate !== undefined) {
        let startDate = new Date(req.query.startDate);
        let endDate = new Date(req.query.endDate);
        startDate.setHours(0,0,0);
        endDate.setHours(23,59,59);
        createdAt = {"$gte": startDate, "$lt": endDate};
    }
    else if(req.query.startDate !== undefined) {
        let startDate = new Date(req.query.startDate);
        startDate.setHours(0,0,0,0);
        createdAt = {"$gte": startDate};
    }
    else {
        endDate = new Date();
        endDate.setHours(23,59,59);
        createdAt = {"$lt": endDate};
    }
    return createdAt
}

const getCustomerOrders = async (user_id, req, res) => {
    const orders = await OrderModel.aggregate([{$match : {user_id : new mongoose.Types.ObjectId(user_id)}}, {$lookup: {
            from: "order_relations",
            localField: "_id",
            foreignField: "order_id",
            as: "tiffin_id"
        }} 
        , { $lookup: {
            from: "tiffins",
            localField: "tiffin_id.tiffin_id",
            foreignField: "_id",
            as: "tiffins"
        }} 
        , { $lookup: {
            from: "users",
            localField: "vender_id",
            foreignField: "_id",
            as: "vender"
        }} 
        , { $unwind: "$vender" } 
    ]);
    res.status('200').send({orders});
}

const getVenderOrders = async (vender_id, req, res) => {
    let createdAt = makeDate(req);
    const orders = await OrderModel.aggregate([{$match : {vender_id : new mongoose.Types.ObjectId(vender_id)}}
        , {$match : {createdAt}} 
        , {$sort : {createdAt : -1} }
        , {$lookup: {
            from: "order_relations",
            localField: "_id",
            foreignField: "order_id",
            as: "tiffin_id"
        }} 
        // , { $unwind: "$tiffin_id" } 
        , { $lookup: {
            from: "tiffins",
            localField: "tiffin_id.tiffin_id",
            foreignField: "_id",
            as: "tiffins"
        }} 
        // , { $unwind: "$tiffins" } 
        , { $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user"
        }} 
        , { $unwind: "$user" } 
        , { $lookup: {
            from: "pgs",
            localField: "user.pg_id",
            foreignField: "_id",
            as: "pg"
        }} 
        , { $unwind: "$pg" } 
    ]);
    res.status('200').send({orders});
}

OrderController.get('/', authenticate, async (req, res) => {
    const user_id = req.userId;
    const role = req.role;
    if(role === "customer")
        getCustomerOrders(user_id, req, res);
    else 
        getVenderOrders(user_id, req, res);
    
})

OrderController.get('/analytics', authenticate, async (req, res) => {
    let createdAt = makeDate(req);
    const user_id = req.userId;
    const totalOrders = await OrderModel.aggregate([{$match : {vender_id : new mongoose.Types.ObjectId(user_id)}}
        , {$match : {createdAt}} 
        , {$sort : {createdAt : -1} }
        , {$group: {_id : "$vender_id",  sum : {$sum:1},  } } 
    ]);
    const totalOrdersSummary = await OrderModel.aggregate([{$match : {vender_id : new mongoose.Types.ObjectId(user_id)}}
        , {$match : {createdAt}} 
        , {$sort : {createdAt : -1} }
        , { $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user"
        }} 
        , { $unwind: "$user" } 
        , { $lookup: {
            from: "pgs",
            localField: "user.pg_id",
            foreignField: "_id",
            as: "pg"
        }} 
        , { $unwind: "$pg" } 
        , {$group: {_id : "$pg.name",  count : {$sum:1},  } } 
    ]);
    res.status('200').send({analytics : {totalOrders, totalOrdersSummary}});
})

OrderController.post('/add', authenticate, async (req, res) => {
    const user_id = req.userId;
    const {total, payment, delivery, coupon, order, vender_id} = req.body;
    const newOrder = await OrderModel.create({user_id, vender_id, total, coupon_id : coupon, delivery, payment});
    const newOrderId = newOrder._id;
    let payload = [];
    for(const order_obj in order) {
        payload.push({ order_id : newOrderId, tiffin_id : order_obj, quantity : order[order_obj] });
    }
    await OrderRelationModel.insertMany(payload);
    await CartModel.deleteMany({user_id});
    res.status('201').send({msg : "Order Placed"});
})


module.exports = {
    OrderController
}