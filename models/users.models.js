const db = require("../db/connection");

exports.getAllUsers = () => {
  return db.query("SELECT * FROM users").then((response) => {
    return response.rows;
  });
};

exports.getUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users where username = $1", [username])
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
      return rows[0];
    });
};
