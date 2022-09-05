const { getAllUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  console.log("in controller");
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
