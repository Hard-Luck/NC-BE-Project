exports.handleUncaughtError = (err, req, res, next) => {
  console.log("UNCAUGHT ERROR: ", err);
  res.status(500).send({ msg: "internal server error" });
};

exports.handlePostgresError = (err, req, res, next) => {
  const pgErrorCodes = ["22P02", "23502", "42703"];
  if (pgErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.badEndpoint = (err, req, res, next) => {
  res.status(400).send({ msg: "page not found" });
};
