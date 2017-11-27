const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const placeSchema = new Schema(

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
        type: String
      },
      description: {
        type: String
      }
  }
);

const PlaceModel = mongoose.model("Place", placeSchema);

module.exports = PlaceModel;
