const express = require("express");
const ControllerUsers = require("../controllers/users");
const users = express.Router();

// Ruta GET para encontrar todos los usuarios.
users.get("/", ControllerUsers.findAll);

// Ruta GET para obtener un usuario por su ID.
users.get("/:id", ControllerUsers.findById);

// Ruta POST para crear un nuevo usuario.
users.post("/", ControllerUsers.create);

// Ruta POST para añadir un producto al carrito de un usuario.
users.post("/add-to-cart", ControllerUsers.addToCart);

// Ruta POST para añadir un producto a los likes de un usuario.
users.post("/add-like", ControllerUsers.addToLikes);

// Ruta POST para vaciar el carrito de un usuario.
users.post("/empty-cart/:userId", ControllerUsers.emptyCart);

module.exports = users;
