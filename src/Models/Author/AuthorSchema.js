const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true]
  },
  middleName: {
    type: String,
    required: [true]
  },
  lastName: {
    type: String,
    required: [true]
  },
  dateOfBirth: {
    type: Date
  },
  description: {
    type: String
  }
});

var Author = mongoose.model("Author", authorSchema);
module.exports = Author;
