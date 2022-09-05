const db = require("../db/connection");

exports.getReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review not found" });
      }
      return rows[0];
    });
};

exports.updateVotes = (review_id, votes) => {
  return db
    .query(
      `           
      UPDATE reviews 
      SET 
        votes = (votes + $1) 
      WHERE 
        review_id = $2
      RETURNING *;
      `,
      [votes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review not found" });
      }
      return rows[0];
    });
};
