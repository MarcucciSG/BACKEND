const express = require("express");
const app = express();
const PUERTO = 8080;


const productRouter = require("./Router/product.router.js")
const cartRouter = require("./Router/cart.router.js")
//midleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productRouter )
app.use("/api/carts", cartRouter)

app.listen(PUERTO);
