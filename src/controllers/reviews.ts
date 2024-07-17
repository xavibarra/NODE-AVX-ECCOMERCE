import { Request, Response } from "express";
const ServiceReviews = require("../services/reviews");

// Definición de la función para encontrar todos los productos.
exports.findAll = function (req: Request, res: Response) {
  return ServiceReviews.findAll(res);
};

// Definición de la función para encontrar 10 reviews por su producto.
exports.findReviewsByProductId = function (req: Request, res: Response) {
  return ServiceReviews.findReviewsByProductId(req, res);
};
