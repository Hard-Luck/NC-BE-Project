const db = require("../db/connection");
const format = require("pg-format");
const {
  selectFromReviewsJoinComments,
  updateVotes,
  selectAllFromTableWhere,
  validSortParams,
  insertIntoTable,
} = require("./utils");

exports.getReviewById = async (review_id) => {
  const result = await selectFromReviewsJoinComments(
    db,
    "reviews.review_id",
    review_id
  );
  if (result.length === 0) {
    return Promise.reject({ status: 404, msg: "review not found" });
  }
  return result[0];
};

exports.updateVotes = async (review_id, votes) => {
  const updatedReview = await updateVotes(
    db,
    "reviews",
    +votes,
    "review_id",
    review_id
  );
  if (updatedReview.length === 0) {
    return Promise.reject({ status: 404, msg: "review not found" });
  }
  return updatedReview[0];
};

exports.getAllReviews = async ({
  sort_by = "created_at",
  category,
  order = "DESC",
}) => {
  const validSorts = validSortParams(sort_by);

  if (!validSorts) {
    return Promise.reject({ status: 404, msg: "sort_by not found" });
  }
  if (!["DESC", "ASC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (sort_by !== "comment_count") {
    sort_by = `reviews.${sort_by}`;
  }

  const results = await selectFromReviewsJoinComments(
    db,
    "category",
    category,
    sort_by,
    order
  );

  if (results.length > 0) return results;
  const categoryCheck = await selectAllFromTableWhere(
    db,
    "categories",
    "slug",
    category
  );
  if (categoryCheck.length > 0) return [];
  return Promise.reject({ status: 404, msg: "category not found" });
};

exports.addReview = async (reqBody) => {
  const columnNames = Object.keys(reqBody);
  const values = Object.values(reqBody);
  const postedReview = await insertIntoTable(
    db,
    "reviews",
    columnNames,
    values
  );
  const review_id = postedReview[0].review_id;
  const review = await selectFromReviewsJoinComments(
    db,
    "reviews.review_id",
    review_id
  );

  return review;
};
