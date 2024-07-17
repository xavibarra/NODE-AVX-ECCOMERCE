const ControllerReviews = require("../controllers/reviews");
const reviews = require("express").Router();

//Encontrar todas las reviews
reviews.get("/", ControllerReviews.findAll);

// Encontrar una review por la id del produto
reviews.get(
  "/findReviewsByProductId/:product_id",
  ControllerReviews.findReviewsByProductId
);

module.exports = reviews;
