const { Schema, model } = require("mongoose");

const orderRelationSchema = new Schema ({
    order_id : Schema.Types.ObjectId,
    tiffin_id : Schema.Types.ObjectId,
    quantity : Number
}, {
    versionKey : false,
    timestamps : true
})

const OrderRelationModel = model("order_relation", orderRelationSchema);

module.exports = {
    OrderRelationModel
}