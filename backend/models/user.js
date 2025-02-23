const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phone: String,
  password: String, // Should be hashed in production
});

module.exports = mongoose.model("users", UserSchema);
