const mongoose = require("mongoose");
// Define a schema
const userSchema = new mongoose.Schema({
  name: { require: true, type: String },
  age: { type: Number },
  email: { type: String, unique: true },
  tweets: [{ type: mongoose.Types.ObjectId, ref: "Tweet" }],
  password: { require: true, type: String },
  userType: {
    type: String,
    enum: ["sso", "normal"],
    default: "normal",
  },
  role: {
    type: String,
    enum: ["user", "editor", "admin"],
    default: "user",
  },
  facebookURL: { type: String },
  username: { type: String },
  createdDate: { type: Date, default: Date.now() },
});
// Create a model
const User = mongoose.model("User", userSchema);
module.exports = User;
