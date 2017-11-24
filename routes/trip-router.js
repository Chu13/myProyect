const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/user-models");
const PlaceModel = require("../models/place-models");

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
    description: req.body.placeStory,
    dateAdded: new Date()
  });

  theTrip.save()

  .then(() => {

    res.redirect("/profile");

  })
  .catch((err) => {
    if(thePlace.errors) {
      res.locals.validationErrors = err.errors;
      res.render("trip-views/trip-form");
    }
    else{
      next(err);
  }
  });
});


module.exports = router;
