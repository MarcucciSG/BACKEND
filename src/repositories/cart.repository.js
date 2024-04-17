const CartModel = require("../models/cart.model.js");

class CartRepository {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito nuevo");
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
      throw new Error("Error al encontrar un carrito por ID");
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );
      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      //marca la propiedad Products como modificada
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto a un carrito");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar el producto del carrito en el gestor");
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;

    } catch (error) {
      throw new Error("Error al actualizar el carrito en el gestor");
    }
  }

  async updateQuantityCart(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified("products");

        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      throw new Error(
        "Error al actualizar la cantidad del producto en el carrito"
      );
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error("Error al vaciar el carrito en el gestor");
    }
  }
}

module.exports = CartRepository;
