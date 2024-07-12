import { Request, Response } from "express";
const Service = require("../services/users");

// Definición de la función para encontrar todas las categorías.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(req, res);
};

// Función para obtener un usuario por su ID.
exports.findById = function (req: Request, res: Response) {
  return Service.findById(req, res);
};

// Definición de la función para crear un nuevo usuario.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};

// Función para añadir un producto al carrito de un usuario.
exports.addToCart = function (req: Request, res: Response) {
  return Service.addToCart(req, res);
};

// Función para añadir un producto al carrito de un usuario.
exports.addToLikes = function (req: Request, res: Response) {
  return Service.addToLikes(req, res);
};
