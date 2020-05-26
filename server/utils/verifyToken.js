const jwt = require("jsonwebtoken");
const { ForbiddenError } = require("apollo-server-express");

exports.verifyToken = function (req, res, next) {
  if (!req) return null;
  const token = req.cookies.jwtToken; //header.split(" ");
  if (typeof token !== "undefined") {
    try {
      const decodedToken = jwt.verify(token, process.env.SERVER_SECRET);
      return decodedToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    return null;
  }
};
