import { Request, Response } from "express";
const Service = require("../services/users");

// Definición de la función para encontrar todas las categorías.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(req, res);
};

// Definición de la función para crear una nueva categoría.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};
