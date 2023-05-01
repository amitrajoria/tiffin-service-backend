const { Schema, model } = require("mongoose");

const pgSchema = new Schema({
    name : {type : String, required : true},
    address : {type : String, required : true}
}, {
    versionKey : false,
    timestamps : true
})

const PGModule = model("PG", pgSchema);

module.exports = {
    PGModule
}