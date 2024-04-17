const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const MessageModel = require("../models/messages.model.js");

class SocketController{

    constructor(httpServer){
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.getProducts() );

            socket.on("eliminarProducto", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await productRepository.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.obtenerProductos());
    }
   
}

module.exports = SocketController;