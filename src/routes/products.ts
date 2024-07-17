const express = require("express");
const ControllerProducts = require("../controllers/products");
const isAdmin = require("../middlewares/isAdmin"); // Importa tu middleware isAdmin
const products = express.Router();

// Ruta GET para encontrar 10 productos según su categoría.
products.get(
  "/productsByCategory/:category_id",
  ControllerProducts.productsByCategory
);

// Ruta GET para encontrar todos los productos (requiere ser administrador)
products.get("/", isAdmin, ControllerProducts.findAll);

// Ruta para filtrar los productos en oferta (requiere ser administrador)
products.get("/offer", isAdmin, ControllerProducts.offerProducts);

// Ruta GET para encontrar un producto por su ID (acceso público)
products.get("/:productId", ControllerProducts.findById);

// Ruta POST para crear un nuevo producto (requiere ser administrador)
products.post("/", isAdmin, ControllerProducts.create);

// Ruta POST para crear múltiples productos (requiere ser administrador)
products.post("/all", isAdmin, ControllerProducts.createMultiple);

// Ruta PUT/PATCH para actualizar un producto por su ID (requiere ser administrador)
products.put("/:productId", isAdmin, ControllerProducts.update);

// Ruta DELETE para eliminar un producto por su ID (requiere ser administrador)
products.delete("/:productId", isAdmin, ControllerProducts.delete);

// Ruta para buscar productos por nombre y categoría (acceso público)
products.get('/search', ControllerProducts.searchByNameAndCategory);

products.get("/search/:name", ControllerProducts.searchByName);

module.exports = products;
