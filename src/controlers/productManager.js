const fs = require("fs");

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(tittle, description, price, img, code, stock) {
    if (!tittle || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El Codigo debe ser unico.");
      return;
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      tittle,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(newProduct);

    await this.saveFile(this.products);
  }

  async getProducts() {
    try {
      const respuesta = await fs.promises.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(respuesta);
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
    
  }

  async getProductsById(id) {
    try {
      const product = await this.getProducts();
      const productFind = product.find((item) => item.id === id);

      if (!productFind) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return productFind;
      }
    } catch (error) {
      console.log("Product Not found", error);
    }
  }

  async updateProducts(id, product) {
    let data = await this.getProducts();
    let i = data.findIndex((e) => e.id == id);
    data.splice(i, 1, product);
  }

  async deleteProducts(id) {
    const data = await this.getProducts();
    let i = data.findIndex((e) => e.id == id);
    data.splice(i, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(data));
  }

  async saveFile(arrayProducts) {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(arrayProducts, null, 2)
      );
    } catch (error) {
      console.log("Error al guardar el archivo, vamos a morir", error);
    }
  }
}

const manager = new ProductManager();

//console.log(manager.getProducts());

/*manager.addProduct(
  "Producto prueba",
  "esto es un producto prueba",
  500,
  "Sin imagen",
  "abc123",
  20
);*/

//console.log(manager.getProducts());

/*manager.addProduct(
  "Producto prueba",
  "esto es un producto prueba",
  500,
  "Sin imagen",
  "abc123",
  20
);*/

//console.log(manager.getProducts());

//manager.getProductsById(2);


module.exports = ProductManager;