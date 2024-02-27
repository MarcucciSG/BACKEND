const express = require("express");
const router = express.Router();

const ProductManager = require("../controlers/productManagerDb.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await productManager.getProducts();
      if (limit) {
        res.json(products.slice(0, limit));
      } else {
        res.json(products);
      }
    } catch (error) {
      console.log("error al obtener los productos", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });
  
  router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
      const product = await productManager.getProductById(id);
      if (!product) {
        res.json({
          error: "Producto Not Found",
        });
      } else {
        res.json(product);
      }
    } catch (error) {
      console.log("error al obtener el producto", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });
  
  router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    console.log(nuevoProducto);
  
    try {
      await productManager.addProduct(nuevoProducto),
        res.status(201).json({ message: "Producto agregado" });
    } catch (error) {
      console.log("error al agregar un producto ", error);
      res.status(500).json({ error: "error del servidor" });
    }
  });
  
  router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
    const productUpdate = req.body;
    try {
      await productManager.updateProduct( id , productUpdate);
      res.json({ message: "Producto Actualizado" });
    } catch {
      console.log("No se pudo actualizar", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });
  
  router.delete("/:pid", async (req, res) =>{
   const  id = req.params.pid;
    const productDelete = req.body;
  
    try {
      await productManager.deleteProduct(id, productDelete);
      res.json({message:"Producto Borrado"});
      } catch (error) {
        console.log("No se pudo borrar", error);
        res.status(500).json({message:"Error del servidor"});
      
    }
  })

  module.exports = router; 