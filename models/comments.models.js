const db = require("../db/connection");

exports.getCommentsForReview = (review_id) => {
  if (typeof +review_id !== "number") {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  return db
    .query(
      `
  SELECT * 
  FROM 
    comments
  WHERE 
    review_id = $1
  `,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      }
      return Promise.reject({ status: 404, msg: "review not found" });
    });
};
