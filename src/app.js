const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controlers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");
//midleware
app.use(express.json());

app.get("/api/products", async (req, res) => {
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

app.get("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const product = await productManager.getProductsById(parseInt(id));
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

app.post("/api/products", async (req, res) => {
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

app.put("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  const productUpdate = req.body;
  try {
    await productManager.updateProduct(parseInt(id), productUpdate);
    res.json({ message: "Producto Actualizado" });
  } catch {
    console.log("No se pudo actualizar", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.delete("/api/products/:pid", async (req, res) =>{
  let id = req.params.pid;
  const productDelete = req.body;

  try {
    await productManager.deleteProduct(parseInt(id), productDelete);
    res.json({message:"Producto Borrado"});
    } catch (error) {
      console.log("No se pudo borrar", error);
      res.status(500).json({message:"Error del servidor"});
    
  }
})

app.listen(PUERTO);
