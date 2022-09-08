const { getAllUsers, getUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUser = (req, res, next) => {
  getUserByUsername(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
