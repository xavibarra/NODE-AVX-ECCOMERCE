import express from 'express';
const Controller = require("../controllers/categories");
const categories = express.Router();

// Ruta GET para encontrar todas las categorías (acceso público)
categories.get("/", Controller.findAll);

// Ruta GET para encontrar una categoría por su ID (acceso público)
categories.get("/:categoryId", Controller.findById);

// Ruta POST para crear una nueva categoría (requiere ser administrador)
categories.post("/", Controller.create);

// Ruta POST para crear múltiples categorías (requiere ser administrador)
categories.post("/all", Controller.createMultiple);

// Ruta PUT/PATCH para actualizar una categoría por su ID (requiere ser administrador)
categories.put("/:categoryId", Controller.update);

// Ruta DELETE para eliminar una categoría por su ID (requiere ser administrador)
categories.delete("/:categoryId", Controller.delete);

module.exports = categories;
