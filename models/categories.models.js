const db = require("../db/connection");

exports.getAllCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories`);
  return rows;
};
