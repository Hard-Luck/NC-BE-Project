const {
  getCommentsForReview,
  addCommentToReview,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  getCommentsForReview(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  addCommentToReview(req.params.review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
