const {
  getCommentsForReview,
  addCommentToReview,
  removeCommentByID,
  updateCommentVotes,
} = require("../models/comments.models");

exports.getComments = async (req, res, next) => {
  try {
    const comments = await getCommentsForReview(
      req.params.review_id,
      req.query
    );
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const comment = await addCommentToReview(req.params.review_id, req.body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await removeCommentByID(req.params.comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  try {
    const comment = await updateCommentVotes(
      req.params.comment_id,
      req.body.inc_votes
    );
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
