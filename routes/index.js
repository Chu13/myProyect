const express = require('express');
const router  = express.Router();

const PlaceModel = require('../models/place-models');

/* GET home page. */
router.get('/', (req, res, next) => {
  PlaceModel
  .find()
  .limit(10)
  .sort({ dateAdded: -1})
  .exec()
  .then((PlacesResults) => {
    res.locals.listOfPlaces = PlacesResults;
    res.render("index");
  })
  .catch((err) => {
    next(err);
  });
});

// Process the search form ins the index page 
router.get('/search', (req, res, next) => {
  const searchRegex = new RegExp(req.query.placeSearch, "i");
    PlaceModel
    .find({ country: searchRegex })
    .exec()
    .then((searchResults) => {
        res.locals.listOfResults = searchResults;
        res.locals.searchTerm = req.query.placeSearch;

        res.render("place-views/search-page");
    })
    .catch((err) => {
        next(err);
    });
});







module.exports = router;
