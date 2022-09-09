const db = require("../db/connection");
const { selectAllFromTableWhere } = require("./db-utils");
exports.getAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
};

exports.getUserByUsername = async (username) => {
  const user = await selectAllFromTableWhere(db, "users", "username", username);
  if (user.length === 0) {
    return Promise.reject({ status: 404, msg: "user not found" });
  }
  return user[0];
};
