const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

console.log("API KEY CHECK:", process.env.CLOUDINARY_API_KEY);

console.log("Cloudinary Config Loaded:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "YES" : "NO",
  secret: process.env.CLOUDINARY_API_SECRET ? "YES" : "NO",
});

module.exports = cloudinary;
