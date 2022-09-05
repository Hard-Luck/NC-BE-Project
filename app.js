const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { handleUncaughtError } = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use(handleUncaughtError);

module.exports = app;
