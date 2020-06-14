import { ValidationError } from "apollo-server-express";
import mongoose from "mongoose";
import * as yup from "yup";

yup.addMethod<yup.StringSchema>(yup.string, "objectId", function (message: string) {
  return this.transform(function (value: string, _originalValue: string) {
    if (this.isType(value) && mongoose.isValidObjectId(value)) {
      return value;
    }
    throw new ValidationError(message);
  });
});
