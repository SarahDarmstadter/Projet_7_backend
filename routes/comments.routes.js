    const router = require("express").Router();
    const comments = require("../controllers/comment.controller.js");
    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer.config');
  
    // Create a new Tutorial
    router.post("/post/:postId/create", auth, comments.createComment);
    router.delete("/post/:postId/comment/:id/delete", auth, comments.deleteComment);
    router.delete("/post/:postId/comment/:id/update", auth, comments.updateComment);

    //router.put("/post/:id/update", auth, comments.updateComment);

    module.exports = router;