const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("NC_Games API", () => {
  describe("GET /api/categories", () => {
    it("200: Returns all category objects with slug and description", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
          expect(body.categories.length > 0).toBe(true);
          body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("200: Returns all reviews for the given review_id", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveProperty("review_id", 2);
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("review_body", expect.any(String));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
          expect(Date.parse(review.created_at)).not.toBeNaN();
        });
    });
    it("404: bad request, when review id is valid but doesn't exist", () => {
      return request(app)
        .get("/api/reviews/10000000")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "review not found" });
        });
    });
    it("400: bad request, when review id is invalid", () => {
      return request(app)
        .get("/api/reviews/invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
  describe("GET /api/users", () => {
    it("200: Returns all category objects with username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});
