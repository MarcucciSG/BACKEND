const fs = require("fs").promises;


class CartManager{

    constructor(path) {
        this.carts = []
        this.path = path
        this.lastID = 0;

        this.loadCart();
    }



    async loadCart(){
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if(this.carts.length > 0){
                this.lastID = Math.max(...this.carts.map(cart => cart.id))
            }
        } catch (error) {
            console.error("No se pudo cargar los carritos", error)
            await this.saveCart();
        }
    }

    async saveCart(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
    }


    async createCart(){
        const newCart = {
            id: ++this.lastID,
            products: []
        }

        this.carts.push(newCart);

        await this.saveCart();
        return newCart;
    }

    async getCartById(cartID){
        try {
            const cart = this.carts.find(cart => cart.id === cartID)
            if(!cart){
                throw new Error(`No existe cart con ese id ${cartID}`)
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener ID de carrito", error)
            throw error;
        }
    }

    async addProductToCart(cartID, productID, quantity = 1){
        const cart = await this.getCartById(cartID);
        const validProduct = cart.products.find(p => p.product === productID);

        if(validProduct){
            validProduct.quantity += quantity;
        } else {
            cart.products.push({product: productID, quantity});
        }

        await this.saveCart();
        return cart;
    }
}

module.exports = CartManager;