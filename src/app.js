const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controlers/productManager.js")
const productManager = new ProductManager("./src/models/products.json")

app.get("/api/products", async (req, res) => {
     try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit){
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
     } catch (error) {
        console.log("error al obtener los productos", error)
        res.status(500).json({error:"Error del servidor"})
     }
});

app.get("/api/products/:pid", async (req, res) =>{
    let id = req.params.pid;
    try {
        const product = await productManager.getProductsById(parseInt(id));
        if(!product){
            res.json({
                error:"Producto Not Found"
            })
        }else {
            res.json(product);
        }
    } catch (error) {
        console.log("error al obtener el producto", error)
        res.status(500).json({error:"Error del servidor"})
    }
})

app.listen(PUERTO);
