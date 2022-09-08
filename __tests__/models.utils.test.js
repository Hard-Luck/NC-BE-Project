const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const { selectAllFromTableWhere, insertIntoTable } = require("../models/utils");

beforeEach(() => seed(testData));
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
    it.only("inserts object into table and returns object", async () => {
      const columns = ["username", "name", "avatar_url"];
      const values = ["MyUserName", "mark", "www.example.com"];
      const results = await insertIntoTable(db, "users", columns, values);
      expect(results).toEqual([
        { username: "MyUserName", name: "mark", avatar_url: "www.example.com" },
      ]);
    });
  });
});
