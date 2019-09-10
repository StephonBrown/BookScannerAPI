const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true]
  },
  author: {
    type: ObjectId,
    required: [true]
  },
  releaseDate: {
    type: Date,
    required: [true]
  },
  isbnNumber: {
    type: String
  },
  description: {
    type: String,
    required: [true]
  },
  publicationLocation: {
    type: String
  }
});

var Book = mongoose.model("Book", bookSchema);
module.exports = Book;
