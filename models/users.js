var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

// Create article schema
var UserSchema = new Schema({
    // title is a required string
    user: {
      type: String,
      required: true
    },
    // comment is a required string
    password: {
      type: String,
      required: true
    }
  });
  
  // Create the User model with the UserSchema
  var User = mongoose.model("User", UserSchema);
  
  // Export the model
  module.exports = User;