const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const BookRouter = require("./ Controllers/BookController");
const AuthorRouter = require("./ Controllers/AuthorController");
const UserRouter = require("./ Controllers/UserController");
const bodyParser = require("body-parser");
const auth = require("./Middleware/Auth").default;
const cors = require("./Middleware/Cors").default;
const hpp = require("hpp");
const url = "mongodb://localhost:27017/BookStorage";
const config = require("config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  if (req.headers["app-token"] !== config.get("app-token")) {
    return res
      .status(401)
      .send(
        "Access denied. No app token You must operate within the Book Application to access these endpoints."
      );
  }
  next();
});
app.use("/books", BookRouter);
app.use("/author", AuthorRouter);
app.use("/user", UserRouter);
app.get("/", function(req, res) {
  res.status(200).send("Hello World");
});

if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDb..."));

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
