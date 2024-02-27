const CartModel = require("../models/cart.model.js");

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear carrito nuevo", error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("No existe cart con ese ID");
        return null;
      }
      return cart;
    } catch (error) {
      console.log("Error al encontrar un carrito por ID", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1){
    try {
        const cart = await this.getCartById(cartId);
        const existProduct = cart.products.find(item => item.product.toString() === productId)

        if(existProduct){
            existProduct.quantity += quantity;
        } else {
            cart.products.push({product: productId, quantity});
        }
        //marca la propiedad Products como modificada
        cart.markModified("products")
        await cart.save()
        return cart;

    } catch (error) {
        console.log("Error al agregar producto a un carrito", error);
      throw error;
    }

  }
}

module.exports = CartManager;