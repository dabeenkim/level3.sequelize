const express = require("express");
const postsRouter = require("./posts");
const commentsRouter = require("./comments");
const usersRouter = require("./users")

const router = express.Router();

router.use('/posts', [postsRouter, commentsRouter]);
router.use("/", [usersRouter]);

module.exports = router;