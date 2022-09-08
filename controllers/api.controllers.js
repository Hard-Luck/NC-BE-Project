const endpoints = require("../endpoints.json");

exports.getAPIJson = (req, res, next) => {
  res.status(200).send({ endpoints });
};
