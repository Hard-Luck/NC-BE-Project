const { getAllCategories } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  getAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
