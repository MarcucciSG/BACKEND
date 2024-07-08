const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controlers/user.controller.js");
const upload = require("../middleware/multer.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/premium/:uid", userController.changeRolePremium);
router.post("/:uid/documents",userController.document, upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), 
    
)

module.exports = router;
