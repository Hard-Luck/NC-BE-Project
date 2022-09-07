const {
  updateVotes,
  getReviewById,
  getAllReviews,
} = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
  getReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  getAllReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  updateVotes(req.params.review_id, req.body.inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
