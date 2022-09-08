const { getAllCategories } = require("../models/categories.models");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).send({ categories });
  } catch (err) {
    next(err);
  }
};
