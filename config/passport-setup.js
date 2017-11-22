const passport = require("passport");
const FbStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const UserModel = require("../models/user-models");

passport.serializeUser((userFromDb, cb) => {

  cb(null, userFromDb._id);

});


passport.deserializeUser((idFromSession, cb) => {

    UserModel.findById(idFromSession)
    .then((userFromDb) => {

        cb(null, userFromDb);

    })
    .catch((err) => {
        cb(err);
    });
});
