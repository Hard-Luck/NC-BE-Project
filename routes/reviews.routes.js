const {
  getReview,
  getReviews,
  patchReview,
  postReview,
  deleteReview,
} = require("../controllers/reviews.controllers");

const {
  getComments,
  postComment,
} = require("../controllers/comments.controllers");

const express = require("express");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews).post(postReview);
reviewsRouter
  .route("/:review_id")
  .get(getReview)
  .patch(patchReview)
  .delete(deleteReview);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
