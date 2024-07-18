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

// Función para actualizar los likes de una review por su ID.
export async function updateLikes(req: Request, res: Response) {
  try {
    const reviewId = parseInt(req.params.id);
    const { incrementBy, setLikesTo } = req.body;

    // Llamar al servicio para actualizar los likes
    const result = await ServiceReviews.updateLikes(
      reviewId,
      incrementBy,
      setLikesTo
    );

    if ("error" in result) {
      return res.status(500).send({ error: result.error });
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({});
  }
}
