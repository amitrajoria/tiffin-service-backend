const { Schema, model } = require("mongoose")

const tiffinSchema = new Schema ({
    title : {type : String, required : true},
    description : {type : String, required : true},
    time : {type : String, required : true},
    price : {type : String , required : true},
    image : {type : String},
    vender_id : String,
    status : {type : Boolean, default : true}
}, {
    versionKey : false,
    timestamps : true
})

const TiffinModel = model("tiffin", tiffinSchema);

module.exports = {
    TiffinModel
}