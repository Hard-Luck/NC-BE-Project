const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const {
  selectAllFromTableWhere,
  insertIntoTable,
  deleteFromTableWhere,
  updateVotes,
  selectFromReviewsJoinComments,
} = require("../models/utils");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("Util functions for models", () => {
  describe("selectAllFromTableWhere", () => {
    it("returns an empty array when no match is found", async () => {
      const results = await selectAllFromTableWhere(
        db,
        "users",
        "username",
        "NOTAUSERNAME"
      );
      expect(results).toHaveLength(0);
    });
    it("Returns an array of objects containing query results", async () => {
      const results = await selectAllFromTableWhere(
        db,
        "users",
        "username",
        "mallionaire"
      );
      expect(results).toHaveLength(1);
    });
  });
  describe("insertIntoTable", () => {
    it("inserts object into table and returns object", async () => {
      const columns = ["username", "name", "avatar_url"];
      const values = ["MyUserName", "mark", "www.example.com"];
      const results = await insertIntoTable(db, "users", columns, values);
      expect(results).toEqual([
        { username: "MyUserName", name: "mark", avatar_url: "www.example.com" },
      ]);
    });
  });
  describe("deleteFromTableWhere", () => {
    it("deletesFrom table where conditions are met and returns object of deleted objects", async () => {
      const successDeleted = await deleteFromTableWhere(
        db,
        "reviews",
        "review_id",
        1
      );
      expect(successDeleted).toHaveLength(1);
    });
    it("returns an empty array if no match is found", async () => {
      await deleteFromTableWhere(db, "reviews", "review_id", 1);
      const failedDeleted = await deleteFromTableWhere(
        db,
        "reviews",
        "review_id",
        1
      );
      expect(failedDeleted).toHaveLength(0);
    });
  });
  describe("updateVotes", () => {
    it("updates votes and returns updated object", async () => {
      const updated = await updateVotes(db, "reviews", 10, "review_id", 6);
      expect(updated[0].votes).toBe(18);
    });
  });
  describe.only("selectFromReviewsJoinComments", () => {
    it("returns rows selected from reviews joined comments when passed a review_id", async () => {
      const results = await selectFromReviewsJoinComments(
        db,
        "reviews.review_id",
        1,
        ["reviews.review_id"],
        "ASC"
      );
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty("review_id", 1);
    });
    it("returns array of objects matching the category", async () => {
      const results = await selectFromReviewsJoinComments(db, "category", [
        "social deduction",
      ]);
      expect(results).toHaveLength(11);
      results.forEach((result) => {
        expect(result).toHaveProperty("category", "social deduction");
      });
    });
  });
});
