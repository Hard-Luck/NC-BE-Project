const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
} = require("./controllers/errors.controllers");

const express = require("express");
const apiRouter = require("./routes/api.routes");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
