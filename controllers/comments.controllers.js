const {
  getCommentsForReview,
  addCommentToReview,
  removeCommentByID,
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

exports.deleteComment = (req, res, next) => {
  console.log(req.params.comment_id);
  removeCommentByID(req.params.comment_id)
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
};
