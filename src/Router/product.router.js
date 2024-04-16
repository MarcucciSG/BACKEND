const express = require("express");
const router = express.Router();
const ProductController = require("../controlers/product.controller.js");
const productControler = new ProductController();

//listar products
router.get("/", productControler.getProducts);
//trae un product por ID
router.get("/:pid", productControler.getProductById);
//agrega nuevo Product
router.post("/", productControler.addProduct);
//update por ID
router.put("/:pid", productControler.updateProduct);
//Delete product
router.delete("/:pid", productControler.deleteProduct);

module.exports = router;
