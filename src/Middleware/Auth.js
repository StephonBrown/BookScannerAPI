const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validate } = require("../Models/User/UserSchema");

module.exports = async function(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }
  try {
    const decoded = await jwt.verify(token, config.get("myprivatekey"), {
      expiresIn: "5m"
    });
    const user = await User.findById(decoded.user._id).select(
      "-passwordHash -userToken"
    );
    req.user = user;
    next();
  } catch (e) {
    res
      .status(400)
      .send("Invalid Token: " + e.message + ". Please log in again.");
  }
};
