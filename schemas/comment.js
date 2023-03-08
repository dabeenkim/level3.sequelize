const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  comment: {
    type: String,
    required: true,
  }
},{ versionKey : false });

module.exports = mongoose.model("comments", commentSchema);
