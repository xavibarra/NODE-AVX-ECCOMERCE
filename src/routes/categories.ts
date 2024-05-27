const Controller = require("../controllers/categories");
const categories = require("express").Router();

// Definición de rutas CRUD

// Ruta GET para encontrar todas las categorías.
categories.get("/", Controller.findAll);

// Ruta GET para encontrar una categoría por su ID.
categories.get("/:categoryId", Controller.findById);

// Ruta POST para crear una nueva categoría.
categories.post("/", Controller.create);

// Ruta POST para crear múltiples categorías.
categories.post("/all", Controller.createMultiple);

// Ruta PUT/PATCH para actualizar una categoría por su ID.
categories.put("/:categoryId", Controller.update);

// Ruta DELETE para eliminar una categoría por su ID.
categories.delete("/:categoryId", Controller.delete);

module.exports = categories;
