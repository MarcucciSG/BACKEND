const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js")

const productRouter = require("./Router/product.router.js");
const cartRouter = require("./Router/cart.router.js");
const viewsRouter = require("./Router/views.router.js");

require("./database.js");
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

io.on("connection", async (socket) => {
  console.log("cliente conectado");

  socket.emit("products", await productManager.getProducts());

  //deleteProducts
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);

    io.socket.emit("products", await productManager.getProducts());
  });

  //addProduct

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);

    io.socket.emit("products", await productManager.getProducts());
  });
});

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {
    //Guardo el mensaje en MongoDB:
    await MessageModel.create(data);

    //Obtengo los mensajes de MongoDB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message", messages);
  });
});
