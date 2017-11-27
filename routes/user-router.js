const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/user-models");
const PlaceModel = require("../models/place-models");
const TripModel = require("../models/trip-models");

const router = express.Router();




// USER SIGNUP ----------------------------
// Show the signup form
router.get("/signup", (req, res, next) => {
    if(req.user) {
      res.redirect("/");

      return;
    }

    res.render("user-views/signup-page");
});

// Process the signup form
router.post("/process-signup", (req, res, next) => {
  if (req.body.signupPassword === "" ||
      req.body.signupPassword.length < 6 ||
      req.body.signupPassword.match(/[^a-z0-9]/i) === null
    ) {
        res.locals.errorMessage = "Password is invalid, should have numbers, letters & special characters";
        res.render("user-views/signup-page");

        return;
      }

      UserModel.findOne({ email: req.body.signupEmail })
      .then((userFromDb) => {

          if(userFromDb !== null){
            res.locals.errorMessage = "Email is taken";
            res.render("user-views/signup-page");
          }

      const salt = bcrypt.genSaltSync(10);

      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel({
        fullName: req.body.signupFullName,
        email: req.body.signupEmail,
        encryptedPassword: scrambledPassword
      });

    return theUser.save();

    })
    .then(() => {
// Redirect after SUCCESSFUL to the index page
      res.redirect("/");
    })
    .catch((err) => {
        next(err);
    });
});


// USER LOGIN ------------------------------------------------
//Show the login form
router.get("/login", (req, res, next) => {
  if(req.user) {
    res.redirect("/");

    return;
  }
    res.render("user-views/login-page");
});

//Process the log in form
router.post("/process-login", (req, res, next) => {
    UserModel.findOne({ email: req.body.loginEmail })
    .then((userFromDb) => {
        if (userFromDb === null){
          res.locals.errorMessage = "Email incorrect";
          res.render("user-views/login-page");

          return;
        }


      const isPasswordGood =
      bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

      if (isPasswordGood === false){
        res.locals.errorMessage = "Password incorrect";
        res.render("user-views/login-page");

        return;
      }

        req.login(userFromDb, (err) => {
          if(err) {

            next(err);
        }
        else {

          res.redirect("/");
        }
        });
     })
    .catch((err) => {
      next(err);
    });
});

// Facebook LOGIN -----------------------------------------------

router.get("/facebook/login", passport.authenticate("facebook"));


router.get("/facebook/success",
  passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login"
  })
);


// Google LOGIN ------------------------------------------------
router.get("/google/login",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read"
    ]
  })
);



router.get("/google/success",
passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login"
})
);

//LOGOUT -------------------------------------------------------

router.get("/logout", (req, res, next) => {
  req.logout();

  res.redirect("/");
});



// Profile ---------------------------------------------------
router.get("/profile", (req, res, next) => {
  TripModel
  .find({ owner: req.user._id })
  .sort({ name: 1 })
  .exec()
  .then((tripResults) => {
    res.locals.listOfTrips = tripResults;
    res.render("user-views/user-profile");
  })
  .catch((err) => {
    next(err);
  });
});

router.get("/profile/edit", (req, res, next) => {
  res.render("user-views/profile-edit");
});

router.post("/profile", (req, res, next) => {
  UserModel.findById(req.user)
  .then((userFromDb) => {
    userFromDb.set({
      residence:   req.body.userResidence,
      nationality: req.body.userNationality,
      birthday:    req.body.userDate
    });

    return userFromDb.save();
  })
  .then(() => {
    res.redirect("/profile");
  })
  .catch((err) => {

    next(err);
  });
});

module.exports = router;
