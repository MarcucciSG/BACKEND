const express = require("express");
const router = express.Router();

const ProductManager = require("../controlers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("home", { products });
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "error interno del servidor" });
  }
});

module.exports = router;
