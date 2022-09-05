const express = require("express");
const { handleUncaughtError } = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.use(handleUncaughtError);

module.exports = app;
