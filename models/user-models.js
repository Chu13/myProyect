const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const userSchema = new Schema(

  {
      fullName: {
        type: String,
        required:[true, "Tell use your name."]
      },
      email: {
          type: String,
          match: [/.+@.+/, "Emails need an @ sign"]
      },
      encryptedPassword:{ type: String },

      facebookID: { type: String },

      googleID: { type: String },

      role: {
        type: String,

        enum: ['normal', 'admin'],
        default: "normal"
      },
      residence:{ type: String },
      nationality: { type: String },
      birthday: { type: String },
  },

  {
      timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
