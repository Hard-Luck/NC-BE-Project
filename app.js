const express = require("express");

const app = express();
const { apiRouter } = require("./routes/routes");

const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
  badEndpoint,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.all("/*", badEndpoint);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
