const ControllerUsers = require("../controllers/users");
const users = require("express").Router();

// Ruta GET para encontrar todas las categorías.
users.get("/", ControllerUsers.findAll);

// Ruta POST para crear una nueva categoría.
users.post("/", ControllerUsers.create);

module.exports = users;
