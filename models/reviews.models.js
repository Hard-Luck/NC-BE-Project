const db = require("../db/connection");

exports.getReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT
        reviews.review_id,
        title,
        category,
        designer,
        owner,
        review_body,
        review_img_url,
        reviews.created_at,
        reviews.votes,
        cast(count(comments.review_id) AS INT) AS comment_count
    FROM
        reviews
    LEFT JOIN 
        comments 
    ON 
        reviews.review_id = comments.review_id
    WHERE 
        reviews.review_id = $1
    GROUP BY
        reviews.review_id
    `,
      [review_id]
    )
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

exports.getAllReviews = () => {
  return db
    .query(
      `
  SELECT 
    owner,
    title,
    reviews.review_id,
    category,
    review_img_url,
    reviews.created_at,
    reviews.votes,
    designer,
    cast(count(comments.review_id) AS INT) AS comment_count
  FROM
    reviews
  LEFT JOIN 
    comments 
  ON 
    reviews.review_id = comments.review_id
  GROUP BY
    reviews.review_id
  ORDER BY
    reviews.created_at DESC
    `
    )
    .then(({ rows }) => rows);
};
