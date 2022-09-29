const express = require("express");
const cors = require("cors");
const app = express();
const { apiRouter } = require("./routes/routes");

const {
  handleUncaughtError,
  handleCustomError,
  handlePostgresError,
  badEndpoint,
} = require("./controllers/errors.controllers");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/api", apiRouter);

app.all("/*", badEndpoint);

app.use(handleCustomError);
app.use(handlePostgresError);
app.use(handleUncaughtError);

module.exports = app;
