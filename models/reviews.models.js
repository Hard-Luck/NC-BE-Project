const db = require("../db/connection");
const {
  selectFromReviewsJoinComments,
  updateVotes,
  selectAllFromTableWhere,
  validSortParams,
  insertIntoTable,
  countReviews,
  deleteFromTableWhere,
} = require("./db-utils");

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
  limit = 10,
  p = 1,
}) => {
  const validSorts = validSortParams(sort_by);

  if (!validSorts) {
    return Promise.reject({ status: 404, msg: "sort_by not found" });
  }
  if (!["DESC", "ASC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (typeof +p !== "number" || typeof +limit !== "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (sort_by !== "comment_count") {
    sort_by = `reviews.${sort_by}`;
  }
  if (((p || +limit) && +p % 1 !== 0) || +limit % 1 !== 0) {
    return Promise.reject({
      status: 400,
      msg: "p and limit must be a positive integer",
    });
  }
  const total = await countReviews(db, category);
  const offset = limit * (p - 1);
  const results = await selectFromReviewsJoinComments(
    db,
    "category",
    category,
    sort_by,
    order,
    +limit,
    +offset
  );
  const maxPage = Math.ceil(total / +limit);
  if (+p > maxPage && maxPage > 0) {
    return Promise.reject({ status: 404, msg: "page not found" });
  }

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

exports.deleteReview = async (review_id) => {
  if (!/[0-9]+/.test(review_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const deleted = await deleteFromTableWhere(
    db,
    "reviews",
    "review_id",
    +review_id
  );
  if (deleted.length === 0) {
    return Promise.reject({ status: 404, msg: "review not found" });
  }
};
