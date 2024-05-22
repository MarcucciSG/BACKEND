const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartUtils.js");
const EmailManager = require("../Service/emails.js");
const emailManager = new EmailManager();

class CartController {
  async newCart(req, res) {
    try {
      const newCart = await cartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      console.error("Error al crear carrito", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async getProductsFromCart(req, res) {
    const cartId = req.params.cid;

    try {
      const carrito = await cartRepository.findById(cartId);

      if (!carrito) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json(carrito.products);
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async addProductsToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const producto = await productRepository.obtenerProductoPorId(productId);

      if (!producto) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Verificar si el usuario es premium y si es propietario del producto
      if (req.user.role === 'premium' && producto.owner === req.user.email) {
          return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
      }
      const updateCart = await CartRepository.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updateCart.products);
    } catch (error) {
      console.error("Error al agregar producto al cart", error);
      res.status(500).json({ error: "Error del servirdor" });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const updatedCart = await cartRepository.deleteProductFromCart(
        cartId,
        productId
      );

      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async updateProductFromCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
      const UpdatedCart = await cartRepository.updateCart(
        cartId,
        updatedProducts
      );
      res.json(UpdatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async updateQuantity(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      const updatedCart = await cartRepository.updateQuantityCart(
        cartId,
        productId,
        newQuantity
      );

      res.json({
        status: "success",
        message: "Cantidad del producto actualizada correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito",
        error
      );
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;

      const updatedCart = await cartRepository.emptyCart(cartId);

      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al vaciar el carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async endPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      //obtenemos el cart y sus products
      const cart = await cartRepository.getCartById(cartId);
      const products = cart.products;
      //inicializamos un array para los productos no disponibles
      const productsNotAvaible = [];

      //verificar stock y actuzalizar products disponibles
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductById(productId);
        if (product.stock >= item.quantity) {
          //si hay stock restar cantidad
          product.stock -= item.quantity;
          await product.save();
        } else {
          //si no hay stock, agrega id product al array
          productsNotAvaible.push(productId);
        }
      }

      const userWithCart = await UserModel.findOne({ cart: cartId });
      //crear ticket de compra
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datatime: new Date(),
        amount: calcularTotal(cart.products),
        pruchaser: userWithCart._id,
      });
      await ticket.save();

      //elima del cart products que se compraron
      cart.products = cart.products.filter((item) =>
        productsNotAvaible.some((productId) => productId.equals(item.product))
      );

      // save cart update en la DB
      await cart.save();

      await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);

      res.status(200).json({ productsNotAvaible });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
