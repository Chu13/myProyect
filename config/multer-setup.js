const multer = require("multer");


const myUploader =
  multer({
    dest: __dirname + '/../public/uploads/'
  });


module.exports = myUploader;
