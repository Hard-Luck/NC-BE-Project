const {
  getReview,
  getReviews,
  patchReview,
} = require("../controllers/reviews.controllers");

const {
  getComments,
  postComment,
} = require("../controllers/comments.controllers");

const express = require("express");
const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReview);
reviewsRouter.patch("/:review_id", patchReview);

reviewsRouter.get("/:review_id/comments", getComments);
reviewsRouter.post("/:review_id/comments", postComment);

module.exports = reviewsRouter;
