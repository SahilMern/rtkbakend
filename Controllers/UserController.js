const userModel = require("../models/userModel");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const validatePassword = require("../middlewares/validator");
const bcrypt = require("bcryptjs");
const { createToken } = require("../services/authServices");
const { UserToken } = require("../models/tokenModel");

//User Register
const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    //required file
    const requiredFields = ["name", "email", "password", "confirmPassword"];
    for (const field of requiredFields) {
      if (!(field in req.body) || !req.body[field]) {
        return res.status(400).json({
          status: false,
          message: `Field '${field}' must have a value`,
        });
      }
    }

    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "User already register with this email",
      });
    }

    const passwordValidatorErrors = validatePassword(password);
    if (passwordValidatorErrors.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid password",
        errors: passwordValidatorErrors,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "password and confirm password not match",
      });
    }

    const count = await userModel.find({}).count();
    const userId = parseInt(count) + 1;
    const userData = new userModel({
      userId,
      name,
      email,
      password,
      confirmPassword,
    });
    await userData.save();
    return res.status(200).json({
      message: "User regsitered suseesfully",
    });
  } catch (error) {
    console.log(error, "error");
  }
};

//user Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //REQUIRED FILED
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!(field in req.body) || !req.body[field]) {
        return res.status(400).json({
          status: false,
          message: `Field '${field}' must have a value`,
        });
      }
    }
    const existEmail = await userModel.findOne({ email });
    if (!existEmail || existEmail === null || existEmail === undefined) {
      return res.status(400).json({
        message: `No user regsitered by this email ${email}`,
      });
    }
    const matchUserpassword = await bcrypt.compare(
      password,
      existEmail.password
    );
    if (!matchUserpassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    const genratedToken = await createToken(req, res, existEmail);
    if (genratedToken.isVerified) {
      res.status(200).json({
        status: true,
        message: "You Login successfully",
        data: existEmail,
        token: genratedToken.token,
      });
    } else {
      res.status(401).json({ status: false, message: "UnAuthorized user!" });
    }
  } catch (error) {
    console.log(error, "error");
  }
};

const allUser = async (req, res) => {
  try {
    const getAllUser = await userModel.find({});
    // console.log(getAllUser,"GetAllUSer");
    return res.status(200).json({
      message: getAllUser,
    });
  } catch (error) {
    console.log(error, "error");
  }
};

//userLogout
const userLogout = async (req, res) => {
  try {
    const token = req.token;
    // console.log(token);
    await UserToken.updateOne({ token: token }, { active: 0, new: true });
    return res
      .status(200)
      .json({ status: true, message: "Succesfully logged out!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error while logout",
      error: error,
    });
  }
};
module.exports = { userRegister, userLogin, allUser, userLogout };
