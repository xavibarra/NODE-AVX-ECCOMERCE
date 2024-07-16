const ControllerReviews = require("../controllers/reviews");
const reviews = require("express").Router();

reviews.get(
  "/findReviewsByProductId/:product_id",
  ControllerReviews.findReviewsByProductId
);

module.exports = reviews;
