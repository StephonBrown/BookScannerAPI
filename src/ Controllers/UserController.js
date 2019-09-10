const express = require("express");
const auth = require("../Middleware/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../Models/User/UserSchema");
const config = require("config");

const UserRouter = express.Router();

UserRouter.get("/current", auth, async (req, res) => {
  res.status(200).send(req.user);
});

UserRouter.route("/").get(auth, async (req, res) => {
  return await User.find(function(err, users) {
    if (!err) {
      return res.send({ result: true, users: users });
    } else {
      console.log(err);
      return res.send({
        result: false,
        errorDesc: "Failed to get data from DB"
      });
    }
  }).select("-passwordHash");
});

UserRouter.route("/create").post(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send("User already registered.");
  }

  if (typeof req !== "undefined") {
    if (req.body.userName === null || req.body.userName === "") {
      errorMessage = "Username is is null or empty";
      return res.send({ result: false, errorDesc: errorMessage });
    } else {
      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        birhtDate: req.body.birthDate,
        avatarUrl: req.body.avatarUrl,
        passwordHash: req.body.passwordHash
      });

      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      await user.save();

      res.status(200).send({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email
      });
    }
  }
});

UserRouter.route("/login").post(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    if (req.get("x-access-token") !== undefined) {
      if (
        await jwt.verify(
          req.headers["x-access-token"],
          config.get("myprivatekey")
        )
      ) {
        return res
          .setHeader("x-access-token", user.userToken.token)
          .status(200)
          .send({
            _id: user._id,
            name: user.name,
            email: user.email
          });
      }
    }

    let hashedPassed = bcrypt.compareSync(req.body.password, user.passwordHash);
    if (!hashedPassed) {
      return res.send({
        result: false,
        errorDesc: "Login credentials are wrong"
      });
    } else {
      const atoken = await user.generateAuthToken();
      user.userToken.token = atoken;
      user.userToken.expiration = atoken.exp;
      await user.save();
      res.setHeader("x-access-token", user.userToken.token);
      return res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    }
  }

  return res.send({
    result: false,
    errorDesc: "Login credentials are wrong "
  });
});

UserRouter.route("/:id")

  // GET BY ID
  .get(function(req, res) {
    return User.findById(req.params.id, function(err, user) {
      if (!err) {
        return res.send({ result: true, user: user });
      } else {
        console.log(err);
        return res.send({
          result: false,
          errorDesc: "error when getting user " + req.params.id
        });
      }
    });
  })
  // UPDATE DATA
  .put(auth, (req, res) => {
    return User.findById(req.params.id, function(err, user) {
      if (req.body.username !== null && req.body.username !== "") {
        user.username = req.body.username;
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.userName = req.body.userName;
      user.email = req.body.email;
      user.birhtDate = req.body.birthDate;
      user.avatarUrl = req.body.avatarUrl;
      user.passwordHash = req.body.password;

      return user.save(function(err) {
        if (!err) {
          console.log("User has been updated " + req.params.userName);
          return res.send({ result: true, user: user });
        } else {
          console.log(err);
          return res.send({
            result: false,
            errorDesc: "error when updating user " + req.params.id
          });
        }
      });
    });
  })

  // DELETE DATA
  .delete(auth, (req, res) => {
    return User.findById(req.params.id, function(err, user) {
      return user.remove(function(err) {
        if (!err) {
          console.log("User " + req.params.id + " removed !");
          return res.send({
            result: true,
            message: "User " + req.params.id + " has been removed"
          });
        } else {
          console.log(err);
          return res.send({
            result: false,
            errorDesc: "error when removing User " + req.params.id
          });
        }
      });
    });
  });

module.exports = UserRouter;
