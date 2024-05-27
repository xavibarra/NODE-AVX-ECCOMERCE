import { Request, Response } from "express";
const Service = require("../services/categories");

// Definición de la función para encontrar todas las categorías.
exports.findAll = function (req: Request, res: Response) {
  return Service.findAll(req, res);
};

// Definición de la función para encontrar una categoría por su ID.
exports.findById = function (req: Request, res: Response) {
  return Service.findById(req, res);
};

// Definición de la función para crear una nueva categoría.
exports.create = function (req: Request, res: Response) {
  return Service.create(req, res);
};

// Definición de la función para crear múltiples categorías.
exports.createMultiple = function (req: Request, res: Response) {
  return Service.createMultiple(req, res);
};

// Definición de la función para eliminar una categoría por su ID.
exports.delete = function (req: Request, res: Response) {
  const id = req.params.categoryId;
  return Service.delete(id, res);
};

// Definición de la función para actualizar una categoría por su ID.
exports.update = function (req: Request, res: Response) {
  const id = req.params.categoryId;
  const updatedCategory = req.body;
  return Service.update(id, updatedCategory, res);
};
