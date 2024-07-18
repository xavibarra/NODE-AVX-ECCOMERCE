import { Request, Response } from "express";
const Service = require("../services/users");

// Definición de la función para encontrar todas las categorías.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(req, res);
};

// Función para obtener un usuario por su ID.
exports.getUserById = function (req: Request, res: Response) {
  return Service.getUserById(req, res);
};

exports.isAdmin = async function (req: Request, res: Response) {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ isAdmin: false, message: "User ID is required" });
  }

  try {
    const isAdmin = await Service.isAdmin(userId);
    return res.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ isAdmin: false, message: "Internal server error" });
  }
};

// Definición de la función para crear un nuevo usuario.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};

// Función para añadir un producto al carrito de un usuario.
exports.addToCart = function (req: Request, res: Response) {
  return Service.addToCart(req, res);
};

exports.checkLike = function (req: Request, res: Response) {
  return Service.checkLike(req, res);
};

// Función para añadir un producto al carrito de un usuario.
exports.addToLikes = function (req: Request, res: Response) {
  return Service.addToLikes(req, res);
};

// Función para añadir un producto al carrito de un usuario.
exports.removeToLikes = function (req: Request, res: Response) {
  return Service.removeToLikes(req, res);
};

// Definición de la función para crear una nueva categoría.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};

// Función para vaciar el carrito de un usuario.
exports.emptyCart = function (req: Request, res: Response) {
  return Service.emptyCart(req, res);
};
