const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
} = require("./controllers/errors.controllers");
const { getReview, patchReview } = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id", getReview);
app.patch("/api/reviews/:review_id", patchReview);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
