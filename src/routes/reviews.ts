const ControllerReviews = require("../controllers/reviews");
const reviews = require("express").Router();

//Encontrar todas las reviews
reviews.get("/", ControllerReviews.findAll);

// Encontrar una review por la id del produto
reviews.get(
  "/findReviewsByProductId/:product_id",
  ControllerReviews.findReviewsByProductId
);

// Crear una nueva review
reviews.post("/createReview", ControllerReviews.createReview);

// Actualizar los likes de una review por su ID
reviews.put("/updateLikes/:id", ControllerReviews.updateLikes);

module.exports = reviews;
