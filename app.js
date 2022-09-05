const express = require("express");
const {
  getCategories,
  getReview,
} = require("./controllers/categories.controllers");
const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
