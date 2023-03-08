const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  title: {
    type:String,
  },
  nickname: {
    type: String,
    required: true
  },
  content: {
    type:String,
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  password: {
    type:Number,
  }
},{ versionKey : false });




module.exports = mongoose.model("posts", postsSchema);