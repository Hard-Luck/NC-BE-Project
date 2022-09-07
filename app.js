const express = require("express");
const app = express();
const apiRouter = require("./routes/api.routes");
const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
