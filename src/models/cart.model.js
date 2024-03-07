const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const cartSchema = new moongose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

//midleware poblacion
cartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price');
  next();
});

const CartModel = moongose.model("carts",cartSchema);

module.exports = CartModel;