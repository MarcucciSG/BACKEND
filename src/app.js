const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
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
//app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//AuthMiddleware
const authMiddleware = require("./middleware/authMiddleware.js");
app.use(authMiddleware);

//passport
initializePassport()
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://marcuccisantiago8:6DkBMXU3lAE3TPUU@cluster0.fehywwf.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});

//obteniendo el array de prodcutos
const ProductManager = require("./controlers/product.controller.js");
const productManager = new ProductManager("./src/models/products.json");


//chat de websocket
const SocketController = require("./sockets/socket.controller.js");
new SocketController(httpServer);