const db = require("../db/connection");
const { insertIntoTable } = require("../models/utils");

exports.getAllCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories`);
  return rows;
};

exports.addCategory = async (categoryObject) => {
  if (!("slug" in categoryObject && "description" in categoryObject)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const { slug, description } = categoryObject;
  if (!(typeof slug === "string" && typeof description === "string")) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const category = await insertIntoTable(
    db,
    "categories",
    ["slug", "description"],
    [slug, description]
  );

  return category[0];
};
