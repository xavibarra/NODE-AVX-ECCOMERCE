const ControllerProducts = require("../controllers/products");
const products = require("express").Router();

// Definición de rutas CRUD

// Ruta GET para encontrar 10 productos según su categoria.
products.get(
  "/productsByCategory/:category_id",
  ControllerProducts.productsByCategory
);

// Ruta GET para encontrar todos los productos.
products.get("/", ControllerProducts.findAll);

// Ruta para filtrar los productos en oferta
products.get("/offer", ControllerProducts.offerProducts);

// Ruta GET para encontrar un producto por su ID.
products.get("/:productId", ControllerProducts.findById);

// Ruta POST para crear un nuevo producto.
products.post("/", ControllerProducts.create);

// Ruta POST para crear múltiples productos.
products.post("/all", ControllerProducts.createMultiple);

// Ruta PUT/PATCH para actualizar un producto por su ID.
products.put("/:productId", ControllerProducts.update);

// Ruta DELETE para eliminar un producto por su ID.
products.delete("/:productId", ControllerProducts.delete);

// Ruta para buscar productos por nombre directamente en la URL.
products.get("/search/:name", ControllerProducts.searchByName);


// Ruta para buscar productos por nombre y categoría.
products.get("/search/:name/:category", ControllerProducts.searchByNameAndCategory);

module.exports = products;
