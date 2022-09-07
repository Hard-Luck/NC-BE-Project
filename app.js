const express = require("express");
const { getAPIJson } = require("./controllers/api.controllers");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getComments,
  postComment,
} = require("./controllers/comments.controllers");
const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
} = require("./controllers/errors.controllers");
const {
  getReview,
  getReviews,
  patchReview,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api", getAPIJson);

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
