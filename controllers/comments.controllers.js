const { getCommentsForReview } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  getCommentsForReview(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
