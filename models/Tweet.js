const mongoose = require("mongoose");

const Tweet = mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: Number,
  },
});

module.exports = mongoose.model("Tweet", Tweet);