const db = require("../db/connection");
const format = require("pg-format");

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

exports.getAllReviews = ({
  sort_by = "created_at",
  category,
  order = "DESC",
}) => {
  const validSorts = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];
  if (validSorts.includes(sort_by)) {
    if (sort_by !== "comment_count") {
      sort_by = `reviews.${sort_by}`;
    }
  } else {
    return Promise.reject({ status: 404, msg: "sort_by not found" });
  }
  if (!["DESC", "ASC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let query = `
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
    `;
  const whereQuery = ` WHERE category = $1 `;
  const orderGroupQuery = format(
    `
  GROUP BY
    reviews.review_id
  ORDER BY
    %1$s %2$s; `,
    sort_by,
    order
  );
  const queryParams = [];
  if (category !== undefined) {
    query += whereQuery;
    queryParams.push(category);
  }
  query += orderGroupQuery;
  return db
    .query(query, queryParams)
    .then(({ rows, rowCount }) => {
      let speciesFound = true;
      if (rowCount === 0) {
        speciesFound = false;
        return Promise.all([
          db.query(`SELECT * from categories WHERE slug = $1`, queryParams),
          speciesFound,
        ]);
      }
      const result = rows;
      return [rows, speciesFound];
    })
    .then(([result, speciesFound]) => {
      if (speciesFound) {
        return result;
      }
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "category not found" });
      }
      return [];
    });
};
