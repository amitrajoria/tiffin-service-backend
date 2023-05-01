const {Schema, model} = require("mongoose");

const userSchema = Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    mobile : String,
    image : String,
    description : String,
    address : String,  
    role : {type : String, enum : ["customer", "vender", "admin"], default : "customer"},
    room_no : String,
    vender_id : String,
    pg_id : Schema.Types.ObjectId,
    status : {type : String, enum : ["active", "inactive"], default : "active"}
}, {
    versionKey : false,
    timestamps : true
})

const UserModel = model("user", userSchema);

module.exports = {
    UserModel
}