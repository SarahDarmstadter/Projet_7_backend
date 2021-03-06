    const router = require("express").Router();
    const users = require("../controllers/user.controller.js");
    const auth = require('../middleware/auth');
    const multer = require ('../middleware/multer.config')

  
    // Create a new User
    router.post("/sign-up",multer, users.signup);
    router.post("/login",  users.login);
    router.get("/profil/:id", auth, multer, users.getProfile);
    router.delete("/:id/suppression-profile", auth, multer, users.deleteProfile);
    router.put("/profil/update", auth, multer, users.modifyUser);






    module.exports = router;