const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

console.log("Cloudinary Final Config:", cloudinary.config());

module.exports = cloudinary;
