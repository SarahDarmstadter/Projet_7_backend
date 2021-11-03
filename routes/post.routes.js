const router = require("express").Router();
const posts = require("../controllers/post.controller.js");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');
  
router.post("/create", auth, multer, posts.createPost);
router.get("/readAll", auth, posts.readAllPosts);
router.get("/:id", auth, posts.readOnePost);
router.get("/posts/:userId", auth, posts.readUserPosts);
router.delete("/:id/delete", auth,  multer, posts.deletePost);
router.put("/:id/update", auth,  multer, posts.updatePost);
router.put("/:id/deleteImg", auth,  multer, posts.deleteImg)

module.exports = router;