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
          expect(review).toHaveProperty("comment_count", 3);
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
  describe("PATCH /api/reviews/:review_id", () => {
    it("200: updates review and returns new review object", () => {
      const reqBody = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/1")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 11,
          });
        });
    });
    it("400: bad request, when review id is invalid", () => {
      const reqBody = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/invalid")
        .send(reqBody)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("400: bad request when request body is incorrect", () => {
      const reqBody = { invalid: 10 };
      return request(app)
        .patch("/api/reviews/1")
        .send(reqBody)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("400: when inc_votes is invalid", () => {
      const reqBody = { inc_votes: "invalid_type" };
      return request(app)
        .patch("/api/reviews/1")
        .send(reqBody)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("404: when review doesnt exist", () => {
      const reqBody = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/12345")
        .send(reqBody)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "review not found" });
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
  describe("GET /api/reviews", () => {
    it("200: Responds with all review objects with owner replaced with username from users table and comment count", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));

            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(Date.parse(review.created_at)).not.toBeNaN();
          });
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("200: returns array with all reviews of the category with category matches are found", () => {
      return request(app)
        .get("/api/reviews?category=social%20deduction")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(11);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));

            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(Date.parse(review.created_at)).not.toBeNaN();
          });
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("200: returns empty array when category is in categories but no revies are returned", () => {
      return request(app)
        .get("/api/reviews?category=children%27s%20games")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toEqual([]);
        });
    });
    it("404: when category is not in categories", () => {
      return request(app)
        .get("/api/reviews?category=NOTACATEGORY")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "category not found" });
        });
    });
  });
  describe("get /api/reviews, with query params", () => {
    it("200: returns reviews sorted by valid column name, votes", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));

            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(Date.parse(review.created_at)).not.toBeNaN();
          });
          expect(reviews).toBeSortedBy("votes", { descending: true });
        });
    });
    it("200: returns reviews in ascending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy("votes");
        });
    });

    it("400: bad request when order type is not ASC or DESC", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes&order=NOTAVALIDORDER")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("404: returns reviews sorted by valid column name", () => {
      return request(app)
        .get("/api/reviews?sort_by=NOTACOLUMN")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "sort_by not found" });
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: Returns array of comments for the given review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("review_id", 2);
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(Date.parse(comment.created_at)).not.toBeNaN();
          });
        });
    });
    it("200: returns an empty array when a review_id is valid but has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    it("400: bad request, when review_id isnt a number", () => {
      return request(app)
        .get("/api/reviews/NOTANUMBER/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("404: review not found, when review_id isn't found", () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "review not found" });
        });
    });
  });
  describe("POST /api/reviews/:review_id/comment", () => {
    it("201: adds comment to a review", () => {
      const commentBody = {
        username: "mallionaire",
        body: "this is a comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(commentBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty("body", commentBody.body);
          expect(body.comment).toHaveProperty("author", commentBody.username);
          expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
          expect(body.comment).toHaveProperty("review_id", 1);
          expect(body.comment).toHaveProperty("votes", 0);
          expect(body.comment).toHaveProperty("created_at", expect.any(String));
          expect(Date.parse(body.comment.created_at)).not.toBeNaN();
        });
    });

    it("400: bad requesst incorrect body format", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ incorrect: true, username: "mallionaire" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("400: review_id invalid", () => {
      return request(app)
        .post("/api/reviews/invalid/comments")
        .send({ body: "body", username: "mallionaire" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    it("404: review not found", () => {
      return request(app)
        .post("/api/reviews/100/comments")
        .send({ body: "body", username: "mallionaire" })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "review not found" });
        });
    });
    it("404: username not found", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({ body: "body", username: "NOTAUSERNAME" })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "username not found" });
        });
    });
  });
  describe("delete comment by comment_id", () => {
    it("404: comment not found", () => {
      return request(app)
        .delete("/api/comments/1991")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "comment not found" });
        });
    });
    it("204: no response body comment deleted", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then(() => {
          return request(app).delete("/api/comments/2").expect(404);
        });
    });
    it("400: bad request id comment id is not a number", () => {
      return request(app)
        .delete("/api/comments/NOTAVALIDID")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});
