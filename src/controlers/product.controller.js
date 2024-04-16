const ProducRepository = require("../repositories/product.repository.js");
const productRepository = new ProducRepository();


class ProductController{
  async addProduct(req, res){
    const nuevoProducto = req.body;
  console.log(nuevoProducto);

  try {
    await productRepository.addProduct(nuevoProducto),
      res.status(201).json({ message: "Producto agregado" });
  } catch (error) {
    console.log("error al agregar un producto ", error);
    res.status(500).json({ error: "error del servidor" });
  }
  }

  async getProducts(req, res){
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productRepository.getProducts({
          limit: parseInt(limit),
          page: parseInt(page),
          sort,
          query,
      });

      res.json({
          status: 'success',
          payload: productos,
          totalPages: productos.totalPages,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          page: productos.page,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
      });

  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
      });
  }
  }

  async getProductById(req, res){
    const id = req.params.pid;
  try {
    const product = await productRepository.getProductById(id);
    if (!product) {
      res.json({
        error: "Producto Not Found",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.log("error al obtener el producto", error);
    res.status(500).json({ error: "Error del servidor" });
  }
  }

  async updateProduct(req, res){
    const id = req.params.pid;
    const productUpdate = req.body;
    try {
      await productRepository.updateProduct(id, productUpdate);
      res.json({ message: "Producto Actualizado" });
    } catch {
      console.log("No se pudo actualizar", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async deleteProduct(req, res){
    const id = req.params.pid;
  const productDelete = req.body;

  try {
    await productRepository.deleteProduct(id, productDelete);
    res.json({ message: "Producto Borrado" });
  } catch (error) {
    console.log("No se pudo borrar", error);
    res.status(500).json({ message: "Error del servidor" });
  }
  }
}

module.exports = ProductController;
