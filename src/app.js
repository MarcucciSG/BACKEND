const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");

const productRouter = require("./Router/product.router.js");
const cartRouter = require("./Router/cart.router.js");
const userRouter = require("./Router/user.router.js");
const sessionRouter = require ("./Router/sessions.router.js")
const viewsRouter = require("./Router/views.router.js");

//midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://marcuccisantiago8:6DkBMXU3lAE3TPUU@cluster0.fehywwf.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//passport
initializePassport()
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});

//obteniendo el array de prodcutos
const ProductManager = require("./controlers/productManagerDb.js");
const productManager = new ProductManager("./src/models/products.json");

//socket.io server
const io = socket(httpServer);
const MessageModel = require("./models/messages.model.js");
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

//chat online
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {
    await MessageModel.create(data);

    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message", messages);
  });
});
