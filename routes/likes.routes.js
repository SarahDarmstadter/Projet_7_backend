const router = require("express").Router();
const likes = require("../controllers/like.controller.js");
const auth = require('../middleware/auth');

router.post("/:postId/like", auth,  likes.createLike);
router.delete("/:postId/:userId/delete", auth,  likes.deleteLike);

module.exports = router;