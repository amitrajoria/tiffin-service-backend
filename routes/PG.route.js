const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorizeVender } = require("../middlewares/authorizeVender");
const { PGModule } = require("../models/PG.module");
const { UserModel } = require("../models/User.model");

const PGController = Router();

PGController.get('/', authenticate, async (req, res) => {
    const pg = await PGModule.find();
    res.status('200').send({pg});
});

PGController.get('/registered', authorizeVender, async (req, res) => {
    const vender_id = req.userId;
    const pgs = await UserModel.aggregate([{$match : {vender_id}}
        , {$lookup: {
            from: "pgs",
            localField: "pg_id",
            foreignField: "_id",
            as: "pg"
        }} 
        , { $unwind: "$pg" } 
        , {$sort : {"pg.name" : 1} }
        , {$group: {_id : "$pg._id",  count : {$sum:1}, pg: { $addToSet: "$pg" } } }   
    ]) 
    console.log(pgs);
    res.status("200").send({pgs});
});

PGController.post('/add', authenticate, async (req, res) => {
    const {name, address} = req.body;
    console.log("Working");
    console.log(req.body);
    if(!name || !address)
        res.status('400').send({msg : 'Name and Address are required field'});
    else {
        const PG = new PGModule({name, address});
        await PG.save();
        res.status("201").send({msg : 'PG Registered Successfully'});
    }
})

module.exports = {
    PGController
}