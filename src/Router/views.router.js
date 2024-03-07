const express = require("express");
const router = express.Router();
const ProductManager = require("../controlers/productManagerDb.js");
const CartManager = require("../controlers/cartManagerDb.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 4 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("products", {
         productos: newArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(),
         // MUY IMPORTANTE!!! lo convertimos a objeto para pasar las restricciones de handlebar
         quantity: item.quantity
      }));


      res.render("carts", { productos: productsInCart });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

module.exports = router;
