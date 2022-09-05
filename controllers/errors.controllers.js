exports.handleUncaughtError = (err, req, res, next) => {
  console.log("UNCAUGHT ERROR: ", err);
  res.status(500).send({ msg: "internal server error" });
};
