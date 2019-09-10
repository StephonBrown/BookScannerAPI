const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true]
  },
  lastName: {
    type: String,
    required: [true]
  },
  userName: {
    type: String,
    required: [true]
  },
  email: {
    type: String,
    required: [true]
  },
  birthDate: {
    type: Date
  },
  avatarUrl: {
    type: String
  },
  passwordHash: {
    type: String,
    required: [true]
  },
  userToken: {
    token: String,
    expiration: Date
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ user: this }, config.get("myprivatekey"), {
    expiresIn: "6h"
  });

  return token;
};

function validateUser(user) {
  const schema = {
    firstName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    userName: Joi.string()
      .min(3)
      .max(20)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    birthDate: Joi.date().required(),
    avatarUrl: Joi.string().optional(),
    passwordHash: Joi.string()
      .min(3)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}
var User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
