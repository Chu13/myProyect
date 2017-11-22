const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/user-models");
const PlaceModel = require("../models/place-models");

const router = express.Router();


// Full List of Places --------------------------------------------------

router.get("/places", (req, res, next) => {
  PlaceModel
  .find()
  .sort({ name: 1})
  .exec()
  .then((placesResults) => {
    res.locals.listOfPlaces = placesResults;
    res.render("place-views/places-list");
  })
  .catch((err) => {
    next(err);
  });
});


// Add New places ---------------------------------------------------------
// Showing the new place form
router.get("/places/new", (req, res, next) => {
  res.render("place-views/place-form");
});


// Process the new places form
router.post("/places", (req, res, next) => {
  const thePlace = new PlaceModel({
    name: req.body.placeName ,
    country: req.body.placeCountry,
    city: req.body.placeCity,
    image: req.body.placeImage,
    description: req.body.placeComments,
    dateAdded: new Date()
  });

  thePlace.save()
// After process the form redirect to the list of places
  .then(() => {

    res.redirect("/places");

  })
  .catch((err) => {
    if(thePlace.errors) {
      res.locals.validationErrors = err.errors;
      res.render("place-views/place-form");
    }
    else{
      next(err);
  }
  });
});


// Show the place details
router.get("/places/details/:Id", (req, res, next) => {
    PlaceModel.findById(req.params.Id)
    .then((placeFromDb) => {
      res.locals.placeDetails = placeFromDb;

      res.render("place-views/place-details");
    })
    .catch((err) => {
      next(err);
    });
});

// Place Edit Form
router.get("/places/:Id/edit", (req, res, next) => {

    PlaceModel.findById(req.params.Id)
      .then((placeFromDb) => {

          res.locals.placeDetails = placeFromDb;

          res.render("place-views/place-edit");
      })
      .catch((err) => {

          next(err);
      });
});


// Receive the edit submission
router.post("/places/:Id", (req, res, next) => {

    PlaceModel.findById(req.params.Id)
      .then((placeFromDb) => {

          placeFromDb.set({
              name:    req.body.placeName,
              country: req.body.placeCountry,
              city:    req.body.placeCity,
              image:   req.body.placeImage
          });


          res.locals.placeDetails = placeFromDb;


          return placeFromDb.save();
      })
      .then(() => {

          res.redirect(`/products/${req.params.Id}`);

      })
      .catch((err) => {

          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("place-views/place-edit");
          }

          else {
              next(err);
          }
      });
});


module.exports = router;
