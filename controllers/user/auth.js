// controllers/authController.js
const bcrypt = require("bcryptjs");
const { User, validate, validateRef } = require("../../models/user/user");
const Token = require("../../models/user/token");

const crypto = require("crypto");
const sendEmail = require("../../utility/sendEmail");
const { ObjectId } = require("mongodb");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//  const { generateResetToken } = require('../utils/tokenUtils');
//  const { sendPasswordResetEmail } = require('../utils/sendEmail');

exports.register = async (req, res, crypto) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let findUser = await User.findOne({ email: req.body.email });
    if (findUser)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      ...req.body,
      password: hashPassword,
      refer: require("crypto").randomBytes(16).toString("hex"),
    }).save();

    const token = await new Token({
      userId: user._id,
      token: require("crypto").randomBytes(16).toString("hex"),
    }).save();
    const url = `http://localhost:3001/email-verification/users/${user.id}/verify/${token.token}`;
    console.log(user.email, url);
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.registerRef = async (req, res, crypto) => {
  console.log(req.body);
  try {
    const { error } = validateRef(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let findUser = await User.findOne({ email: req.body.email });
    if (findUser)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      ...req.body,
      password: hashPassword,
      refer: require("crypto").randomBytes(16).toString("hex"),
    }).save();

    const token = await new Token({
      userId: user._id,
      token: require("crypto").randomBytes(16).toString("hex"),
    }).save();
    const url = `http://localhost:3000/email-verification/users/${user.id}/verify/${token.token}`;
    console.log(user.email, url);
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.registerVerifyToken = async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });
    const token = await Token.findOne({
      userId: new ObjectId(user._id),
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Token.deleteMany({ userId: new ObjectId(user._id) });
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const loginValidate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

exports.login = async (req, res) => {
  try {
    const { error } = loginValidate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `http://localhost:3000/email-verification/users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }
      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }
    const token = user.generateAuthToken();
    res.status(200).send({
      token: token,
      userId: user._id,
      message: "logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.googleLogin = async (req, res) => {
  const userAccessToken = req.query.access_token;
  if (!userAccessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userAccessToken}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          Accept: "application/json",
        },
      }
    );

    const userInfo = response.data;
    console.log(userInfo.email, userAccessToken);

    try {
      const user = await User.findOne({ email: userInfo.email });
      if (user) {
        const token = user.generateAuthToken();
        console.log(token);
        res.status(200).send({
          token: token,
          userId: user._id,
          message: "logged in successfully",
        });
      } else {
        const item = await User.create({
          email: userInfo.email,
          userAccessToken: userAccessToken,
          refer: require("crypto").randomBytes(16).toString("hex"),
          reference: req.body.reference,
        });
        const token = item.generateAuthToken();
        res.status(200).send({
          token: token,
          userId: user._id,
          message: "logged in successfully",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(err.status);
    }
  } catch (error) {
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      config: error.config,
      response: error.response
        ? {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers,
          }
        : null,
    });
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "An error occurred while fetching user info" });
  }
  // const token = user.generateAuthToken();
  // res.status(200).send({
  //   token: token,
  //   userId: user._id,
  //   message: "logged in successfully",
  // });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3000/reset-password/users/${user._id}/verify/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({
          Status: "An Email sent to your account please verify",
        });
      }
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate(
            { _id: id },
            { password: hash },
            { $set: { verified: true } }
          )
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};