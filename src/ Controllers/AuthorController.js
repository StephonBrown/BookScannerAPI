const express = require("express");
const auth = require("../Middleware/Auth");
const Author = require("../Models/Author/AuthorSchema").default;

const AuthorRouter = express.Router();

AuthorRouter.route("/")
  .get(auth, function(req, res) {
    return Author.find(function(err, authors) {
      if (!err) {
        return res.send({ result: true, authors: authors });
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
    let author;
    let errorMessage = "";
    if (typeof req !== "undefined") {
      if (req.body.firstName === null || req.body.title === "") {
        errorMessage = "Author first name is null or empty";
        return res.send({ result: false, errorDesc: errorMessage });
      } else {
        author = new Author({
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth,
          description: req.body.description
        });

        author.save(function(err) {
          if (!err) {
            return res.status(200).send({ result: true, author: author });
          } else {
            return res.status(404).send({ result: false, errorDesc: err });
          }
        });
      }
    }
  });

AuthorRouter.route("/:id")
  // GET BY ID
  .get(auth, function(req, res) {
    return Author.findById(req.params.id, function(err, author) {
      if (!err) {
        return res.send({ result: true, author: author });
      } else {
        console.log(err);
        return res.send({
          result: false,
          errorDesc: "Error retreiving author id: " + req.params.id
        });
      }
    });
  })
  // UPDATE DATA
  .put(auth, function(req, res) {
    Author.findById(req.params.id, function(err, author) {
      if (req.body.firstName !== null && req.body.firstName !== "") {
        (author.firstName = req.body.firstName),
          (author.middleName = req.body.middleName),
          (author.lastName = req.body.lastName),
          (author.dateOfBirth = req.body.dateOfBirth),
          (author.description = req.body.description);
      }
    });
    return author.save(function(err) {
      if (!err) {
        console.log("Author has been updated " + req.params.id);
        return res.send({ result: true, author: author });
      } else {
        console.log(err);
        return res.send({
          result: false,
          errorDesc: "Error when updating author " + req.params.id
        });
      }
    });
  })
  // DELETE DATA
  .delete(auth, function(req, res) {
    return Author.findById(req.params.id, function(err, author) {
      return author.remove(function(err) {
        if (!err) {
          console.log("Author " + req.params.id + " removed !");
          return res.send({
            result: true,
            message: "Author " + req.params.id + " has been removed"
          });
        } else {
          console.log(err);
          return res.send({
            result: false,
            errorDesc: "Rrror when removing author " + req.params.id
          });
        }
      });
    });
  });

module.exports = AuthorRouter;
