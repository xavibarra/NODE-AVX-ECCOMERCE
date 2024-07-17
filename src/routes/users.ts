const express = require("express");
const ControllerUsers = require("../controllers/users");
const users = express.Router();

// Ruta GET para encontrar todos los usuarios (requiere ser administrador)
users.get("/", ControllerUsers.findAll);

// Ruta para encontrar un usuario por su id
users.get("/getById/:userId", ControllerUsers.getUserById);

// Ruta GET para verificar si un usuario ha dado like a un producto (requiere ser administrador)
users.get("/check-like", ControllerUsers.checkLike);

// Ruta POST para crear un nuevo usuario (acceso público)
users.post("/", ControllerUsers.create);

// Ruta POST para añadir un producto al carrito de un usuario (acceso público)
users.post("/add-to-cart", ControllerUsers.addToCart);

// Ruta POST para añadir un producto a los likes de un usuario (acceso público)
users.post("/add-like", ControllerUsers.addToLikes);

// Ruta DELETE para eliminar un producto de los likes de un usuario (acceso público)
users.delete("/remove-like", ControllerUsers.removeToLikes);

// Ruta POST para vaciar el carrito de un usuario (acceso público)
users.post("/empty-cart/:userId", ControllerUsers.emptyCart);



module.exports = users;
