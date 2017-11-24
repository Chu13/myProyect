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

// Login with facebook

passport.use(
  new FbStrategy(

    {

        clientID:     "?????",

        clientSecret: "?????",


        callbackURL: "/facebook/success"
    },


    (accessToken, refreshToken, profile, callback) => {

        console.log('FACEBOOK profile -----------------------');
        console.log(profile);


        UserModel.findOne({ facebookID: profile.id })
          .then((userFromDb) => {

              if (userFromDb) {

                  callback(null, userFromDb);
                  return;
              }


              const theUser = new UserModel({
                  facebookID: profile.id,
                  fullName: profile.displayName
              });

              return theUser.save();
          })
          .then((newUser) => {

              callback(null, newUser);
          })
          .catch((err) => {

              callback(err);
          });
    }
  )
);

// LOGIN with Google

passport.use(
  new GoogleStrategy (

    {

        clientID: "?????",
        clientSecret: "?????",


        callbackURL: "/google/success",


        proxy: true
    },


    (accessToken, refreshToken, profile, callback) => {

      console.log('Google profile ---------------------');
      console.log(profile);


      UserModel.findOne({ googleID: profile.id })
      .then((userFromDb) => {

        if (userFromDb) {

        callback(null, userFromDb);
        return;
      }


      const theUser = new UserModel({
        googleID: profile.id,

        fullName: profile.displayName
      });

        return theUser.save();
      })
      .then((newUser) => {

        callback(null, newUser);
      })
      .catch((err) => {

          callback(err);
      });
    }
  )
);
