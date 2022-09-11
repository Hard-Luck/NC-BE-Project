const {
  updateVotes,
  getReviewById,
  getAllReviews,
  addReview,
  deleteReview,
} = require("../models/reviews.models");

exports.getReview = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await getAllReviews(req.query);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.patchReview = async (req, res, next) => {
  try {
    const review = await updateVotes(req.params.review_id, req.body.inc_votes);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.postReview = async (req, res, next) => {
  try {
    const review = await addReview(req.body);
    res.status(201).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await deleteReview(req.params.review_id);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
