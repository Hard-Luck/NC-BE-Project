const format = require("pg-format");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

exports.selectAllFromTableWhere = async (
  database,
  table,
  column_name,
  valueToMatch,
  limit,
  offset
) => {
  let query = format(
    `SELECT * FROM %1$I WHERE %2$I = %L `,
    table,
    column_name,
    [valueToMatch]
  );
  let limitQuery = ` LIMIT $1 OFFSET $2`;
  const queryParams = [];
  if (limit && offset) {
    query += limitQuery;
    queryParams.push(limit, offset);
  }
  const { rows } = await database.query(query, queryParams);
  return rows;
};

exports.insertIntoTable = async (database, table, column_names, values) => {
  const query = format(
    `
  INSERT INTO %1$I 
    (%2$I) 
  VALUES 
    (%3$L)
  RETURNING *;
  `,
    table,
    column_names,
    values
  );
  const { rows } = await database.query(query);
  return rows;
};

exports.deleteFromTableWhere = async (database, table, column_name, value) => {
  const query = format(
    `DELETE FROM %1$I WHERE %2$I = %3$L RETURNING *;`,
    table,
    column_name,
    [value]
  );
  const { rows } = await database.query(query);
  return rows;
};

exports.updateVotes = async (
  database,
  table,
  increment,
  columnName,
  matchingValue
) => {
  query = format(
    `           
  UPDATE %1$I 
  SET 
   votes = votes + %2$L 
  WHERE 
     %3$I = %4$L
  RETURNING *;
  `,
    table,
    increment,
    columnName,
    matchingValue
  );
  const { rows } = await database.query(query);
  return rows;
};

exports.selectFromReviewsJoinComments = async (
  database,
  columnName,
  matchingValue,
  sortBy = "reviews.created_at",
  orderDirection = "DESC",
  limit = 10,
  offset = 0
) => {
  let query = `
  SELECT 
    owner,
    title,
    reviews.review_id,
    category,
    review_body,
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
  if (
    matchingValue &&
    (columnName === "reviews.review_id" || columnName === "category")
  ) {
    const whereQuery = format(` WHERE %1$s = %2$L`, columnName, matchingValue);
    query += whereQuery;
  }
  const orderGroupQuery = format(
    `
  GROUP BY
    reviews.review_id
  ORDER BY
    %1$s %2$s
  LIMIT %3$s
  OFFSET %4$s`,
    sortBy,
    orderDirection,
    limit,
    offset
  );

  query += orderGroupQuery;
  const { rows } = await database.query(query);
  return rows;
};

exports.validSortParams = (sortBy) => {
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
  return validSorts.includes(sortBy);
};

exports.countReviews = async (database, category) => {
  let query = `
  SELECT * from reviews`;

  if (category) {
    query += format(` WHERE category = %L`, category);
  }

  const { rowCount } = await database.query(query);
  return rowCount;
};

exports.countComments = async (database, review_id) => {
  query = `SELECT * from comments where review_id = $1`;
  const { rowCount } = await database.query(query, [review_id]);
  return rowCount;
};
