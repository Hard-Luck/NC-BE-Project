const db = require("../db/connection");
const { insertIntoTable, selectAllFromTableWhere } = require("./utils");

exports.getCommentsForReview = async (review_id) => {
  if (typeof +review_id !== "number") {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const comments = await selectAllFromTableWhere(
    db,
    "comments",
    "review_id",
    review_id
  );
  if (comments.length > 0) {
    return comments;
  }
  const validReviewCheck = await selectAllFromTableWhere(
    db,
    "reviews",
    "review_id",
    review_id
  );

  if (validReviewCheck.length > 0) {
    return [];
  }
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

exports.removeCommentByID = (comment_id) => {
  if (typeof +comment_id !== "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING
    *;
      `,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.updateCommentVotes = (comment_id, votes) => {
  return db
    .query(
      `           
      UPDATE comments 
      SET 
        votes = (votes + $1) 
      WHERE 
        comment_id = $2
      RETURNING *;
      `,
      [votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return rows[0];
    });
};
