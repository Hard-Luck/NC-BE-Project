const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
beforeEach(() => seed(testData));
afterAll(() => db.end());
describe("NC_Games API", () => {
  describe("GET /api", () => {
    it("200 and returns a list of endpoints", async () => {
      const { body } = await request(app).get("/api").expect(200);
      expect(body).toHaveProperty("endpoints");
    });
  });
  describe("GET /api/categories", () => {
    it("200: Returns all category objects with slug and description", async () => {
      const { body } = await request(app).get("/api/categories").expect(200);
      expect(typeof body).toBe("object");
      expect(body.categories.length > 0).toBe(true);
      body.categories.forEach((category) => {
        expect(category).toHaveProperty("slug", expect.any(String));
        expect(category).toHaveProperty("description", expect.any(String));
      });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    it("200: Returns all reviews for the given review_id", async () => {
      const { body } = await request(app).get("/api/reviews/2").expect(200);
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
    it("404: bad request, when review id is valid but doesn't exist", async () => {
      const { body } = await request(app)
        .get("/api/reviews/10000000")
        .expect(404);
      expect(body).toEqual({ msg: "review not found" });
    });
    it("400: bad request, when review id is invalid", async () => {
      const { body } = await request(app)
        .get("/api/reviews/invalid")
        .expect(400);
      expect(body).toEqual({ msg: "bad request" });
    });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  it("200: updates review and returns new review object", async () => {
    const reqBody = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(200);
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
  it("400: bad request, when review id is invalid", async () => {
    const reqBody = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/invalid")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: bad request when request body is incorrect", async () => {
    const reqBody = { invalid: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: when inc_votes is invalid", async () => {
    const reqBody = { inc_votes: "invalid_type" };
    const { body } = await request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("404: when review doesnt exist", async () => {
    const reqBody = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/reviews/12345")
      .send(reqBody)
      .expect(404);
    expect(body).toEqual({ msg: "review not found" });
  });
  describe("GET /api/users", () => {
    it("200: Returns all category objects with username, name and avatar_url", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(typeof body).toBe("object");
      expect(body.users).toHaveLength(4);
      body.users.forEach((user) => {
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("avatar_url", expect.any(String));
      });
    });
  });
  describe("GET /api/reviews - paginated", () => {
    it("200: Responds with all review objects with owner replaced with username from users table and comment count", async () => {
      const { body } = await request(app).get("/api/reviews").expect(200);
      const { reviews } = body;
      //Was 13 but pagination has been added
      expect(reviews).toHaveLength(10);
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
    it("returns last 3 reviews when second page is requested", async () => {
      const { body } = await request(app).get("/api/reviews?p=2").expect(200);
      const { reviews } = body;
      //Was 13 but pagination has been added
      expect(reviews).toHaveLength(3);
    });
    it("200: returns array with all reviews of the category with category matches are found", async () => {
      const { body } = await request(app)
        .get("/api/reviews?category=social%20deduction")
        .expect(200);
      const { reviews } = body;
      // was 11 then pagination
      expect(reviews).toHaveLength(10);
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
    it("200: returns empty array when category is in categories but no revies are returned", async () => {
      const { body } = await request(app)
        .get("/api/reviews?category=children%27s%20games")
        .expect(200);
      expect(body.reviews).toEqual([]);
    });
    it("404: when category is not in categories", async () => {
      const { body } = await request(app)
        .get("/api/reviews?category=NOTACATEGORY")
        .expect(404);
      expect(body).toEqual({ msg: "category not found" });
    });
    it("404: when page is not in bound", async () => {
      const { body } = await request(app)
        .get("/api/reviews?p=10000")
        .expect(404);
      expect(body).toEqual({ msg: "page not found" });
    });
    it("400: when page is not a positive integer", async () => {
      const { body } = await request(app)
        .get("/api/reviews?p=3.14159")
        .expect(400);
      expect(body).toEqual({
        msg: "p and limit must be a positive integer",
      });
    });
    it("400: when limit is not a positive integer", async () => {
      const { body } = await request(app)
        .get("/api/reviews?limit=1.1")
        .expect(400);
      expect(body).toEqual({
        msg: "p and limit must be positive integers",
      });
    });
  });
  describe("get /api/reviews, with query params", () => {
    it("200: returns reviews sorted by valid column name, votes", async () => {
      const { body } = await request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200);
      const { reviews } = body;
      expect(reviews).toHaveLength(10);
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
  it("200: returns reviews in ascending order", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200);
    const { reviews } = body;
    expect(reviews).toHaveLength(10);
    expect(reviews).toBeSortedBy("votes");
  });
  it("400: bad request when order type is not ASC or DESC", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=votes&order=NOTAVALIDORDER")
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("404: returns reviews sorted by valid column name", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=NOTACOLUMN")
      .expect(404);
    expect(body).toEqual({ msg: "sort_by not found" });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: Returns array of comments for the given review_id", async () => {
      const { body } = await request(app)
        .get("/api/reviews/2/comments")
        .expect(200);
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
  it("200: returns an empty array when a review_id is valid but has no comments", async () => {
    const { body } = await request(app)
      .get("/api/reviews/1/comments")
      .expect(200);
    expect(body.comments).toEqual([]);
  });
  it("400: bad request, when review_id isnt a number", async () => {
    const { body } = await request(app)
      .get("/api/reviews/NOTANUMBER/comments")
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("404: review not found, when review_id isn't found", async () => {
    const { body } = await request(app)
      .get("/api/reviews/100/comments")
      .expect(404);
    expect(body).toEqual({ msg: "review not found" });
  });
  it("404: when page is not in bound", async () => {
    const { body } = await request(app)
      .get("/api/reviews/2/comments?p=10000")
      .expect(404);
    expect(body).toEqual({ msg: "page not found" });
  });
  it("400: when page is not a positive integer", async () => {
    const { body } = await request(app)
      .get("/api/reviews/2/comments?p=3.14159")
      .expect(400);
    expect(body).toEqual({
      msg: "bad request",
    });
  });
  it("400: when limit is not a positive integer", async () => {
    const { body } = await request(app)
      .get("/api/reviews/2/comments?limit=1.1")
      .expect(400);
    expect(body).toEqual({
      msg: "bad request",
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: adds comment to a review", async () => {
      const commentBody = {
        username: "mallionaire",
        body: "this is a comment",
      };
      const { body } = await request(app)
        .post("/api/reviews/1/comments")
        .send(commentBody)
        .expect(201);
      expect(body.comment).toHaveProperty("body", commentBody.body);
      expect(body.comment).toHaveProperty("author", commentBody.username);
      expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
      expect(body.comment).toHaveProperty("review_id", 1);
      expect(body.comment).toHaveProperty("votes", 0);
      expect(body.comment).toHaveProperty("created_at", expect.any(String));
      expect(Date.parse(body.comment.created_at)).not.toBeNaN();
    });
  });
  it("400: bad requesst incorrect body format", async () => {
    const { body } = await request(app)
      .post("/api/reviews/1/comments")
      .send({ incorrect: true, username: "mallionaire" })
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: review_id invalid", async () => {
    const { body } = await request(app)
      .post("/api/reviews/invalid/comments")
      .send({ body: "body", username: "mallionaire" })
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("404: review not found", async () => {
    const { body } = await request(app)
      .post("/api/reviews/100/comments")
      .send({ body: "body", username: "mallionaire" })
      .expect(404);
    expect(body).toEqual({ msg: "review not found" });
  });
  it("404: username not found", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/comments")
      .send({ body: "body", username: "NOTAUSERNAME" })
      .expect(404);
    expect(body).toEqual({ msg: "username not found" });
  });
  describe("delete comment by comment_id", () => {
    it("404: comment not found", async () => {
      const { body } = await request(app)
        .delete("/api/comments/1991")
        .expect(404);
      expect(body).toEqual({ msg: "comment not found" });
    });
  });
  it("204: no response body comment deleted", async () => {
    await request(app).delete("/api/comments/2").expect(204);
    await request(app).delete("/api/comments/2").expect(404);
  });
  it("400: bad request id comment id is not a number", async () => {
    const { body } = await request(app)
      .delete("/api/comments/NOTAVALIDID")
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  describe("GET /api/users/:username", () => {
    test("200: returns user object when username is a match", async () => {
      const expected = {
        username: "mallionaire",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "haz",
      };
      const { body } = await request(app)
        .get("/api/users/mallionaire")
        .expect(200);
      expect(body.user).toEqual(expected);
    });
  });
  test("404: returns user not found when username is not a match", async () => {
    const { body } = await request(app)
      .get("/api/users/NOTAUSERNAME")
      .expect(404);
    expect(body).toEqual({ msg: "user not found" });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("200: updates comment and returns new comment object", async () => {
      const reqBody = { inc_votes: 10 };
      const expected = {
        comment_id: 1,
        body: "I loved this game too!",
        votes: 26,
        author: "bainesface",
        review_id: 2,
      };
      const { body } = await request(app)
        .patch("/api/comments/1")
        .send(reqBody)
        .expect(200);
      expect(body.comment).toEqual(
        expect.objectContaining({
          created_at: expect.any(String),
          ...expected,
        })
      );
      expect(Date.parse(body.comment.created_at)).not.toBeNaN();
    });
  });
  it("400: bad request, when comment id is invalid", async () => {
    const reqBody = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/comments/invalid")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: bad request when request body is incorrect", async () => {
    const reqBody = { invalid: 10 };
    const { body } = await request(app)
      .patch("/api/comments/1")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: when inc_votes is invalid", async () => {
    const reqBody = { inc_votes: "invalid_type" };
    const { body } = await request(app)
      .patch("/api/comments/1")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("404: when comment doesnt exist", async () => {
    const reqBody = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/comments/12345")
      .send(reqBody)
      .expect(404);
    expect(body).toEqual({ msg: "comment not found" });
  });
  describe("POST /api/review", () => {
    it("adds a review to the table and returns the new entry object", async () => {
      const reqBody = {
        owner: "mallionaire",
        title: "test title",
        review_body: "test body",
        designer: "test designer",
        category: "dexterity",
      };
      const { body } = await request(app)
        .post("/api/reviews")
        .send(reqBody)
        .expect(201);
      expect(body.review[0]).toHaveProperty("owner", "mallionaire");
      expect(body.review[0]).toHaveProperty("title", "test title");
      expect(body.review[0]).toHaveProperty("review_body", "test body");
      expect(body.review[0]).toHaveProperty("designer", "test designer");
      expect(body.review[0]).toHaveProperty("category", "dexterity");
      expect(body.review[0]).toHaveProperty("review_id", expect.any(Number));
      expect(body.review[0]).toHaveProperty("votes", 0);
      expect(body.review[0]).toHaveProperty("comment_count", 0);
      expect(Date.parse(body.review[0].created_at)).not.toBeNaN();
    });
  });
  it("400 bad request if request columnn names are invalid", async () => {
    const reqBody = {
      invalid1: "string",
      invalid2: "string",
      invalid3: "string",
      invalid4: "string",
      invalid5: "string",
    };
    const { body } = await request(app)
      .post("/api/reviews")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400 bad request if request columnn values are undefined or wrong type", async () => {
    const reqBody = {
      owner: "string",
    };
    const { body } = await request(app)
      .post("/api/reviews")
      .send(reqBody)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  describe("POST api/categories", () => {
    it("200: adds a category and returns a category object", async () => {
      const postCategory = {
        slug: "test slug",
        description: "test description",
      };
      const { body } = await request(app)
        .post("/api/categories")
        .send(postCategory)
        .expect(201);
      expect(body).toEqual({ category: postCategory });
    });
  });
  it("400: bad request, when incorrect object keys are passed", async () => {
    const postCategory = { slug: "test slug", notakey: "invalid" };
    const { body } = await request(app)
      .post("/api/categories")
      .send(postCategory)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  it("400: bad request when values of wrong type are passed", async () => {
    const postCategory = {
      slug: "test slug",
      description: ["Shouldnt work"],
    };
    const { body } = await request(app)
      .post("/api/categories")
      .send(postCategory)
      .expect(400);
    expect(body).toEqual({ msg: "bad request" });
  });
  describe("DELETE /api/reviews/:review_id", () => {
    it("200 deletes a review and responds with an empty body", async () => {
      const { body } = await request(app).delete("/api/reviews/2").expect(200);
    });
    it("400: bad request when review id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/reviews/NAN")
        .expect(400);
      expect(body).toEqual({ msg: "bad request" });
    });
  });
  it("404: review not found when review id is not found", async () => {
    const { body } = await request(app)
      .delete("/api/reviews/10000")
      .expect(404);
    expect(body).toEqual({ msg: "review not found" });
  });
});
