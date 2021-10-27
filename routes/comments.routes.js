const router = require("express").Router();
const comments = require("../controllers/comment.controller.js");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');
  
router.post("/:postId/create", auth, multer, comments.createComment);
router.delete("/:id/delete", auth, multer, comments.deleteComment);
router.put("/:id/update", auth, multer, comments.updateComment);
router.get("/read", auth, multer,comments.readComments)
router.get("/read/:id", auth, multer,comments.readPostComments)
router.get(":id/read", auth, multer, comments.readOneComment)

module.exports = router;