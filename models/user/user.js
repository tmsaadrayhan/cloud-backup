const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userAccessToken: String,
  password: String,
  verified: { type: Boolean, default: false },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 1,
  numeric: 1,
  requirementCount: 2,
};

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity(complexityOptions)
      .required()
      .label("Password"),
  });
  return schema.validate(data);
};
const validateRef = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity(complexityOptions)
      .required()
      .label("Password"),
    reference: Joi.string(),
  });
  return schema.validate(data);
};

module.exports = { User, validate, validateRef };
