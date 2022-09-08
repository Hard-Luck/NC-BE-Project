const {
  categoriesRouter,
  usersRouter,
  reviewsRouter,
  commentsRouter,
} = require("./routes");

const express = require("express");
const { getAPIJson } = require("../controllers/api.controllers");
const apiRouter = express.Router();

apiRouter.route("/").get(getAPIJson);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
