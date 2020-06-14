const { ValidationError } = require("apollo-server-express");
const mongoose = require("mongoose");
const yup = require("yup");

yup.addMethod(yup.string, "objectId", function (message) {
  return this.transform(function (value, originalValue) {
    if (this.isType(value) && mongoose.isValidObjectId(value)) {
      return value;
    }
    throw new ValidationError(message);
  });
});
