const db = require("../db/connection");

exports.getAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
};

exports.getUserByUsername = async (username) => {
  const { rowCount, rows } = await db.query(
    "SELECT * FROM users where username = $1",
    [username]
  );
  if (rowCount === 0) {
    return Promise.reject({ status: 404, msg: "user not found" });
  }
  return rows[0];
};
