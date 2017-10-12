var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

// Create article schema
var CommentSchema = new Schema({
    // title is a required string
    user: {
      type: String,
      required: true
    },
    // comment is a required string
    comment: {
      type: String,
      required: true
    }
  });
  
  // Create the Comment model with the CommentSchema
  var Comment = mongoose.model("Comment", CommentSchema);
  
  // Export the model
  module.exports = Comment;