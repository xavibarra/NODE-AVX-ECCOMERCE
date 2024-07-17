const express = require("express");
const Controller = require("../controllers/categories");
const isAdmin = require("../middlewares/isAdmin"); // Importa tu middleware isAdmin
const categories = express.Router();

// Ruta GET para encontrar todas las categorías (acceso público)
categories.get("/", Controller.findAll);

// Ruta GET para encontrar una categoría por su ID (acceso público)
categories.get("/:categoryId", Controller.findById);

// Ruta POST para crear una nueva categoría (requiere ser administrador)
categories.post("/", isAdmin, Controller.create);

// Ruta POST para crear múltiples categorías (requiere ser administrador)
categories.post("/all", isAdmin, Controller.createMultiple);

// Ruta PUT/PATCH para actualizar una categoría por su ID (requiere ser administrador)
categories.put("/:categoryId", isAdmin, Controller.update);

// Ruta DELETE para eliminar una categoría por su ID (requiere ser administrador)
categories.delete("/:categoryId", isAdmin, Controller.delete);

module.exports = categories;
