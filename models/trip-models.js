const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const tripSchema = new Schema(

  {
      name: {
        type: String,
        required:[true, "Tell use your name."]
      },
      country: {
          type: String,
          required: [true, "Enter the Country name."]
      },
      city:{
        type: String,
        required:[true, "Enter the city name"]
      },
      image: {
        type: String,
        required:[true, "Add an image of your trip"]
      },
      story: {
        type: String,
        min: 50,
        required: [true, "Tell your trip story"]
      }
  },

      {
        timestamps: true
      }
);

const TripModel = mongoose.model("Trip", tripSchema);

module.exports = PlaceModel;
