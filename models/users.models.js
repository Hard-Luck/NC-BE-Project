const db = require("../db/connection");

exports.getAllUsers = async () => {
  const results = await db.query("SELECT * FROM users");
  return results.rows;
};
