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
const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/users", getUsers);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
