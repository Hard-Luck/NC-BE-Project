const { deleteComment } = require("../controllers/comments.controllers");

const express = require("express");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
