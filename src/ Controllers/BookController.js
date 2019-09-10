const express = require("express");
const auth = require("../Middleware/Auth");
const Book = require("../Models/Book/BookSchema");

const BookRouter = express.Router();

BookRouter.route("/")
  .get(auth, function(req, res) {
    return Book.find(function(err, books) {
      if (!err) {
        return res.send({ result: true, books: books });
      } else {
        console.log(err);
        return res.send({
          result: false,
          errorDesc: "Failed to get data from DB"
        });
      }
    });
  })
  .post(auth, function(req, res) {
    let book;
    let errorMessage = "";
    if (typeof req !== "undefined") {
      if (req.body.title === null || req.body.title === "") {
        errorMessage = "Title of book is null or empty";
        return res.send({ result: false, errorDesc: errorMessage });
      } else {
        book = new Book({
          title: req.body.title,
          author: req.body.author,
          releaseDate: req.body.releaseDate,
          isbnNumber: req.body.isbnNumber,
          description: req.body.description,
          publicationLocation: req.body.description
        });

        book.save(function(err) {
          if (!err) {
            return res.status(200).send({ result: true, book: book });
          } else {
            return res.status(404).send({ result: false, errorDesc: err });
          }
        });
      }
    }
  });

BookRouter.route("/:id")
  // GET BY ID
  .get(auth, function(req, res) {
    return Book.findById(req.params.id, function(err, book) {
      if (!err) {
        return res.send({ result: true, book: book });
      } else {
        console.log(err);
        return res.send({
          result: false,
          errorDesc: "error when get book " + req.params.id
        });
      }
    });
  })
  // UPDATE DATA
  .put(auth, function(req, res) {
    return Book.findById(req.params.id, function(err, book) {
      if (req.body.title !== null && req.body.title !== "") {
        book.title = req.body.title;
      }
      book.description = req.body.description;
      book.author = req.body.author;
      book.releaseDate = req.body.releaseDate;
      book.isbnNumber = req.body.isbnNumber;
      book.publicationLocation = req.body.description;

      return book.save(function(err) {
        if (!err) {
          console.log("book has been updated " + req.params.id);
          return res.send({ result: true, book: book });
        } else {
          console.log(err);
          return res.send({
            result: false,
            errorDesc: "error when update book " + req.params.id
          });
        }
      });
    });
  })
  // DELETE DATA
  .delete(auth, function(req, res) {
    return Book.findById(req.params.id, function(err, book) {
      return book.remove(function(err) {
        if (!err) {
          console.log("book " + req.params.id + " removed !");
          return res.send({
            result: true,
            message: "book " + req.params.id + " has been removed"
          });
        } else {
          console.log(err);
          return res.send({
            result: false,
            errorDesc: "error when remove book " + req.params.id
          });
        }
      });
    });
  });

module.exports = BookRouter;
