const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// LOGIN DE GITHUB

router.get("/github",passport.authenticate("github", {
  scope:["user:email"]}) ,async (req, res) => {});

  router.get("/githubcallback",passport.authenticate("github",
  {failureRedirect:"/login"}), async (req, res) =>{
    //recordar que github retorna el usuario, hay que agregarlo a la session
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");

  } );
  

module.exports = router;
