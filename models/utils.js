const format = require("pg-format");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

exports.selectAllFromTableWhere = async (
  database,
  table,
  column_name,
  valueToMatch
) => {
  query = format(
    `
    SELECT * 
    FROM
        %1$I
    WHERE
        %2$I = %L
        `,
    table,
    column_name,
    [valueToMatch]
  );
  const { rows } = await database.query(query);
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
    `
    DELETE FROM %1$I
    WHERE
        %2$I = %3$L
    RETURNING *;`,
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
  whereColumnName,
  matchingValue,
  orderBy = "reviews.review_id",
  orderDirection = "DESC"
) => {
  const query = format(
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
        %1$s = %2$L
    GROUP BY
        reviews.review_id
    ORDER BY
        %3$s %4$s

    `,
    whereColumnName,
    matchingValue,
    orderBy,
    orderDirection
  );
  console.log(query);
  const { rows } = await database.query(query);
  return rows;
};
