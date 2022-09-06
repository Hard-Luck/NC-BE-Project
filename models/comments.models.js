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
    .then((results) => {
      let flag = true;
      if (results.rows.length > 0) {
        return Promise.all([results, flag]);
      }
      flag = false;
      return Promise.all([
        db.query(
          ` SELECT * 
            FROM 
              reviews
            WHERE 
              review_id = $1`,
          [review_id]
        ),
        flag,
      ]);
    })
    .then(([results, flag]) => {
      if (flag) {
        return results.rows;
      }
      if (results.rows.length > 0) {
        return [];
      }
      return Promise.reject({ status: 404, msg: "review not found" });
    });
};

exports.addCommentToReview = (review_id, { username, body }) => {
  const query = `
  INSERT INTO comments
    (body, author, review_id)
  VALUES
   ($1, $2, $3)
  RETURNING *;
  `;

  return db.query(query, [body, username, review_id]).then(({ rows }) => {
    return rows[0];
  });
};
