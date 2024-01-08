class ProductManager {
  static ultId = 0;

  constructor() {
    this.products = [];
  }

  addProduct(tittle, description, price, img, code, stock) {
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
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      console.error("Not Found");
    } else {
      console.log(product);
    }
  }
}

const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct(
  "Producto prueba",
  "esto es un producto prueba",
  500,
  "Sin imagen",
  "abc123",
  20
);

//console.log(manager.getProducts());

manager.addProduct(
    "Producto prueba",
    "esto es un producto prueba",
    500,
    "Sin imagen",
    "abc123",
    20
  );
  
  console.log(manager.getProducts());

  manager.getProductsById(2)

