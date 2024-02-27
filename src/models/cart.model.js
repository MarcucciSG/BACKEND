const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const cartSchema = new moongose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = moongose.model("carts",cartSchema);

module.exports = CartModel;