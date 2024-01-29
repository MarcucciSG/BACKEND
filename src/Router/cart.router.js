const express = require("express");
const router = express.Router();
const CartManager = require("../controlers/cartManager.js");
const cartManager = new CartManager("./src/models/cart.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});


router.get("/:cid", async(req, res) =>{
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el cart", error)
        res.status(500).json({error: "Error del servidor"})
    }
});

router.post("/:cid/product/:pid", async (req, res) =>{
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al cart", error);
        res.status(500).json({error:"Error del servirdor"});
    }
})

module.exports = router;
