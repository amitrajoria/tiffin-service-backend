const express = require("express");
const mongoose = require('mongoose');
const { authorizeVender } = require("../middlewares/authorizeVender");
const { UserModel } = require("../models/User.model");

const CustomerController = express.Router();

CustomerController.get("/", authorizeVender, async (req, res) => {
    const vender_id = req.userId;
    const customers = await UserModel.aggregate([{$match : {vender_id}}
        , {$sort : {name : 1} }
        , {$lookup: {
            from: "pgs",
            localField: "pg_id",
            foreignField: "_id",
            as: "pg"
        }} 
        , { $unwind: "$pg" } 
    ])
    // console.log(customers);
    res.status("200").send({customers});
})

module.exports = {
    CustomerController
}