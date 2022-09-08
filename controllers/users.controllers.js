const { getAllUsers, getUserByUsername } = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
