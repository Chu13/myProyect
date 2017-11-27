const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/user-models");
const PlaceModel = require("../models/place-models");
const TripModel = require("../models/trip-models");

const router = express.Router();

// Adding a new Trip -------------------------------------
// New Trip Form
router.get("/trips/new", (req, res, next) =>{
  res.render("trip-views/trip-form");
});


router.post("/trips", (req, res, next) => {
  const theTrip = new TripModel({
    name: req.body.placeName ,
    country: req.body.placeCountry,
    city: req.body.placeCity,
    image: req.body.placeImage,
    story: req.body.placeStory,
    owner: req.user,
    dateAdded: new Date()
  });

  theTrip.save()

  .then(() => {

    res.redirect("/profile");

  })
  .catch((err) => {
    if(theTrip.errors) {
      res.locals.validationErrors = err.errors;
      res.render("trip-views/trip-form");
    }
    else{
      next(err);
  }
  });
});








module.exports = router;
