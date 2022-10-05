const {
  getReview,
  getReviews,
  patchReviewVotes,
  postReview,
  deleteReview,
  patchReviewBody,
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
  .patch(patchReviewVotes)
  .delete(deleteReview);

reviewsRouter.route("/:review_id/edit").patch(patchReviewBody);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
