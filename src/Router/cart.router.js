const express = require("express");
const router = express.Router();
const CartManager = require("../controlers/cartManagerDb.js");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");

//crea cart
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//lista de products en cart especifico
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
      const carrito = await CartModel.findById(cartId)
          
      if (!carrito) {
          console.log("No existe ese carrito con el id");
          return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json(carrito.products);
  } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

//agrega products a carts
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar producto al cart", error);
    res.status(500).json({ error: "Error del servirdor" });
  }
});

//borra un product especifico del cart

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartManager.deleteProductFromCart(
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
});

//actualiza products from cart

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;

  try {
    const UpdatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(UpdatedCart);
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

//update quantity de products

router.put('/:cid/product/:pid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      const updatedCart = await cartManager.updateQuantityCart(cartId, productId, newQuantity);

      res.json({
          status: 'success',
          message: 'Cantidad del producto actualizada correctamente',
          updatedCart,
      });
  } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito', error);
      res.status(500).json({
          status: 'error',
          error: 'Error interno del servidor',
      });
  }
});

//empty Cart
router.delete('/:cid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      
      const updatedCart = await cartManager.emptyCart(cartId);

      res.json({
          status: 'success',
          message: 'Todos los productos del carrito fueron eliminados correctamente',
          updatedCart,
      });
  } catch (error) {
      console.error('Error al vaciar el carrito', error);
      res.status(500).json({
          status: 'error',
          error: 'Error interno del servidor',
      });
  }
});
module.exports = router;
