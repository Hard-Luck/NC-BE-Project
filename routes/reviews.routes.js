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
reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
