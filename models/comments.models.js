const db = require("../db/connection");

exports.getCommentsForReview = (review_id) => {
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
    .then(({ rows }) => rows);
};
