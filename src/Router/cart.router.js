const express = require("express");
const router = express.Router();
const CartController = require("../controlers/cart.controller.js");
const cartController = new CartController();

//crea cart
router.post("/", cartController.newCart);
//lista de products en cart especifico
router.get("/:cid",cartController.getProductsFromCart);
//agrega products a carts
router.post("/:cid/product/:pid",cartController.addProductsToCart);
//borra un product especifico del cart
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
//actualiza products from cart
router.put("/:cid", cartController.updateProductFromCart);
//update quantity de products
router.put('/:cid/product/:pid', cartController.updateQuantity);
//empty Cart
router.delete('/:cid', cartController.emptyCart);

module.exports = router;
