const format = require("pg-format");
const db = require("../db/connection");

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
