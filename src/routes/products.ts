import express from 'express';
const ControllerProducts = require("../controllers/products");
const products = express.Router();

// Ruta GET para encontrar 10 productos según su categoría.
products.get(
  "/productsByCategory/:category_id",
  ControllerProducts.productsByCategory
);

// Ruta GET para encontrar todos los productos (requiere ser administrador)
products.get("/", ControllerProducts.findAll);

// Ruta para filtrar los productos en oferta (requiere ser administrador)
products.get("/offer", ControllerProducts.offerProducts);

// Ruta GET para encontrar un producto por su ID (acceso público)
products.get("/:productId", ControllerProducts.findById);

// Ruta POST para crear un nuevo producto (requiere ser administrador)
products.post("/", ControllerProducts.create);

// Ruta POST para crear múltiples productos (requiere ser administrador)
products.post("/all", ControllerProducts.createMultiple);

// Ruta PUT/PATCH para actualizar un producto por su ID (requiere ser administrador)
products.put("/:productId", ControllerProducts.update);

// Ruta DELETE para eliminar un producto por su ID (requiere ser administrador)
products.delete("/:productId", ControllerProducts.delete);

// Ruta para buscar productos por nombre directamente en la URL.
products.get("/search/:name", ControllerProducts.searchByName);



// Rutas de búsqueda con diferentes filtros
products.get('/searchByPrice/:minPrice/:maxPrice', ControllerProducts.searchByPrice);
products.get('/searchByPriceAndName/:minPrice/:maxPrice/:name', ControllerProducts.searchByPriceAndName);
products.get('/searchByPriceAndCategory/:minPrice/:maxPrice/:category', ControllerProducts.searchByPriceAndCategory);
products.get('/searchByAllFilters/:minPrice/:maxPrice/:name/:category', ControllerProducts.searchByAllFilters);



products.get("/search/:name", ControllerProducts.searchByName);

module.exports = products;
