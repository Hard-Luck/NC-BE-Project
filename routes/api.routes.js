const {
  categoriesRouter,
  usersRouter,
  reviewsRouter,
  commentsRouter,
} = require("./routes");

const express = require("express");
const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
