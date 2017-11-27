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

router.get("/trip/details/:Id", (req, res, next) => {
    TripModel.findById(req.params.Id)
    .then((tripFromDb) => {
      res.locals.tripDetails = tripFromDb;
      res.render("trip-views/trip-details");
    })
    .catch((err) => {
      next(err);
    });
});

// Place Edit Form
router.get("/trip/:Id/edit", (req, res, next) => {

    TripModel.findById(req.params.Id)
      .then((tripFromDb) => {

          res.locals.tripDetails = tripFromDb;

          res.render("trip-views/trip-edit");
      })
      .catch((err) => {

          next(err);
      });
});


// Receive the edit submission
router.post("/trip/:Id", (req, res, next) => {

    TripModel.findById(req.params.Id)
      .then((tripFromDb) => {

          tripFromDb.set({
              name:    req.body.tripName,
              country: req.body.tripCountry,
              city:    req.body.tripCity,
              image:   req.body.tripImage,
              story: req.body.tripStory
          });


          res.locals.tripDetails = tripFromDb;


          return tripFromDb.save();
      })
      .then(() => {

          res.redirect(`/trip/details/${req.params.Id}`);

      })
      .catch((err) => {

          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("trip-views/trip-edit");
          }

          else {
              next(err);
          }
      });
});


router.get("/trip/:Id/delete", (req, res, next) => {
  TripModel.findByIdAndRemove(req.params.Id)
  .then((tripFromDb) => {
    res.redirect("/products");
  })
  .catch((err) => {
    next(err);
  });
});



module.exports = router;
