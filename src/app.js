const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;

const productRouter = require("./Router/product.router.js");
const cartRouter = require("./Router/cart.router.js");
const viewsRouter = require("./Router/views.router.js");
//midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});

//obteniendo el array de prodcutos
const ProductManager = require("./controlers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");

//socket.io server
const io = socket(httpServer);

io.on("connection", () => {
  console.log("cliente conectado");
});
