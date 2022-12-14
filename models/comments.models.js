const db = require("../db/connection");
const {
  insertIntoTable,
  selectAllFromTableWhere,
  deleteFromTableWhere,
  updateVotes,
  countComments,
} = require("../utils/query-functions");
const { isANumber } = require("../utils/validation");

exports.getCommentsForReview = async (review_id, { p = 1, limit = 10 }) => {
  if (!(isANumber(review_id) && isANumber(p) && isANumber(limit))) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const totalComments = await countComments(db, review_id);
  const offset = (p - 1) * limit;
  const maxPage = Math.ceil(totalComments / limit);
  if (+p > maxPage && maxPage > 0) {
    return Promise.reject({ status: 404, msg: "page not found" });
  }

  const comments = await selectAllFromTableWhere(
    db,
    "comments",
    "review_id",
    review_id,
    limit,
    offset
  );
  if (comments.length > 0) return comments;

  const validReviewCheck = await selectAllFromTableWhere(
    db,
    "reviews",
    "review_id",
    review_id
  );

  if (validReviewCheck.length > 0) return [];

  return Promise.reject({ status: 404, msg: "review not found" });
};

exports.addCommentToReview = async (review_id, { username, body }) => {
  const review = await selectAllFromTableWhere(
    db,
    "reviews",
    "review_id",
    review_id
  );
  if (review.length === 0) {
    return Promise.reject({ status: 404, msg: "review not found" });
  }
  const user = await selectAllFromTableWhere(db, "users", "username", username);
  if (user.length === 0) {
    return Promise.reject({ status: 404, msg: "username not found" });
  }

  const column_names = ["body", "author", "review_id"];
  const values = [body, username, review_id];

  const comment = await insertIntoTable(db, "comments", column_names, values);
  return comment[0];
};

exports.removeCommentByID = async (comment_id) => {
  if (!isANumber(comment_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const deleted = await deleteFromTableWhere(
    db,
    "comments",
    "comment_id",
    comment_id
  );
  if (deleted.length === 0) {
    return Promise.reject({ status: 404, msg: "comment not found" });
  }
};

exports.updateCommentVotes = async (comment_id, votes) => {
  const updated = await updateVotes(
    db,
    "comments",
    +votes,
    "comment_id",
    comment_id
  );
  if (updated.length === 0) {
    return Promise.reject({ status: 404, msg: "comment not found" });
  }
  return updated[0];
};
