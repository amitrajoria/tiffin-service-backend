const { Schema, model } = require("mongoose");

const cartSchema = new Schema ({
    user_id : String,
    tiffin_id : Schema.Types.ObjectId,
    vender_id : String
}, {
    versionKey : false,
    timestamps : true
})

const CartModel = model("cart", cartSchema);

module.exports = {
    CartModel
}