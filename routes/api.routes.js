const express = require("express");

const { getCategories } = require("../controllers/categories.controllers");
const {
  getComments,
  postComment,
  deleteComment,
} = require("../controllers/comments.controllers");
const {
  getReview,
  getReviews,
  patchReview,
} = require("../controllers/reviews.controllers");
const { getUsers } = require("../controllers/users.controllers");

const apiRouter = express.Router();

apiRouter.get("/categories", getCategories);

apiRouter.get("/users", getUsers);

apiRouter.get("/reviews", getReviews);
apiRouter.get("/reviews/:review_id", getReview);
apiRouter.patch("/reviews/:review_id", patchReview);

apiRouter.get("/reviews/:review_id/comments", getComments);
apiRouter.post("/reviews/:review_id/comments", postComment);

apiRouter.delete("/comments/:comment_id", deleteComment);

module.exports = apiRouter;
