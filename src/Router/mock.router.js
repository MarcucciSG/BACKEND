const express = require("express");
const router = express.Router();
const mockUtils = require("../utils/utilsMocks.js")


router.get("/", (req, res) => {
    //generamos un array de usuarios
    const products = [];
  
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }
    res.json(products);
  });
  
  module.exports = router;
  

