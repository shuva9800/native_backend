const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");
require("dotenv").config();

// Signup controller
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user is exists or not
    const currentUser = await User.findOne({ email: email });
    if (currentUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // password hassing
    const hasPassword = bcrypt.hashSync(password, 10);
    // insert user info in DB
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hasPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User Signin successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find user by email
    const person = await User.findOne({ email: email });
    if (!person) {
      return res.status(404).json({
        success: false,
        message: "user nor register go to signin page",
      });
    }
    //password checking
    const validPassword = bcrypt.compareSync(password, person.password);
    if (validPassword) {
      const token = jwt.sign({ id: person._id }, process.env.jwt_secret);
      person.password = "undefined";

      return res
        .cookie("loginToken", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json({
          success: true,
          message: "user login successfully",
          token,
          data: person,
        });
    } else {
      return res.status(404).json({
        success: false,
        message: "password does not match try again",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
