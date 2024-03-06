import userModel from "../../../../db/models/user.model.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendOurEmail,
  sendResetPasswordMail,
} from "../../../services/sendEmail.js";
import randomstring from "randomstring";

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ message: "ok Done", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  let { userName, age, email, password, Cpassword, address } = req.body;
  if (password != Cpassword)
    return res.json({ message: "password and correct password should match" });
  let foundeduser = await userModel.findOne({ email: req.body.email });
  console.log(foundeduser);
  if (foundeduser) {
    res.json({ message: "User alredy register" });
  } else {
    let hashedpassword = bcrypt.hashSync(password, 10);
    let addeduser = await userModel.insertMany({
      userName,
      age,
      email,
      address,
      password: hashedpassword,
    });
    let token = jwt.sign({ id: addeduser[0]._id }, "Newuser");
    let url = `http://localhost:5000/user/verify/${token}`;
    sendOurEmail(email, url);
    res.json({ message: "added", addeduser });
  }
};

export const verification = async (req, res) => {
  let { token } = req.params;
  jwt.verify(token, "Newuser", async (err, decoded) => {
    let foundeduser = await userModel.findById(decoded.id);
    if (!foundeduser) return res.json({ message: "invalid user" });
    let updateduser = await userModel.findByIdAndUpdate(
      decoded.id,
      { isverified: true },
      { new: true }
    );
    res.json({ message: "verification Done", updateduser });
  });
};


export const signIn = async (req, res, next) => {
  let { email, password } = req.body;
  let foundedUser = await userModel.findOne({ email });
  if (!foundedUser) return res.json({ message: "u need to register first" });
  if (!foundedUser.isverified)
    return res.json({ message: "please verify your account first " });
  let matchedPassword = bcrypt.compareSync(password, foundedUser.password);
  if (matchedPassword) {
    let token = jwt.sign(
      { id: foundedUser.id, role: foundedUser.role },
      "yomna"
    );
    res.json({ message: "welcome", token });
  } else {
    res.json({ message: "Invalid password" });
  }
};

export const updateUser = async (req, res) => {
  let foundedUser = await userModel.findById(req.params.id);
  if (foundedUser) {
    let { userName, age, email , address} = req.body;
    let updateduser = await userModel.findByIdAndUpdate(
      foundedUser._id,
      { userName, age, email, address },
      { new: true }
    );
    res.json({ message: "Updated", updateduser });
  } else {
    res.json({ message: "user not found" });
  }
};

export const deleteUser = async (req, res) => {
  let foundeduser = await userModel.findByIdAndDelete(req.params.id);
  if (foundeduser) {
    res.json({ message: "User Deleted", foundeduser });
  } else {
    res.json({ message: "user not found" });
  }
};

export const sortedUsers = async (req, res) => {
  let foundeduser = await userModel.find().sort({ userName: 1 });

  if (foundeduser) {
    res.json({ message: "User Sorted", foundeduser });
  } else {
    res.json({ message: "user not found" });
  }
};

export const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;

      const user = await userModel.findById(userId);

      if (user) {
          res.json({ user });
      } else {
          res.json({ message: 'user not found' });
      }
  } catch (error) {
      res.json({ message: error.message, data: null });
  }
};

import express from 'express';

const router = express.Router();

// Endpoint to get user profile
router.get('/user/profile', verification, async (req, res) => {
  try {
    // Get user ID from decoded token
    const userId = req.userId;

    // Fetch user profile data from the database
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user profile data in response
    res.status(200).json({
      userName: user.userName,
      email: user.email,
      age: user.age,
      address: user.address
      // You can include other fields as needed
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;


export const securePassword = async (password) => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await userModel.findOne({ email });

    if (foundUser) {
      const randomCode = randomstring.generate();
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      const updatedDate = await userModel.updateOne(
        { email },
        { $set: { resetCode: randomCode, resetCodeExpiration: expirationTime } }
      );

      // Send the random code to the user via email
      sendResetPasswordMail(foundUser.userName, foundUser.email, randomCode);

      return res
        .status(200)
        .json({ message: "Please check your email for the verification code" });
    } else {
      return res.status(404).json({ message: { message: "User not found" } });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    const foundUser = await userModel.findOne({ email, resetCode });

    if (foundUser) {
      return res.status(200).json({ message: "Code verification successful" });
    } else {
      return res.status(404).json({ message: "Invalid code or email" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_email = req.body.email;

    if (!user_email) {
      return res.status(400).json({
        status: "error",
        message: "User email is missing",
        data: null,
      });
    }

    const secure_password = await securePassword(password);
    const updatedData = await userModel.findOneAndUpdate(
      { email: user_email },
      { $set: { password: secure_password, token: "" } }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found", data: null });
    }

    // res.json("reset success");
    res.json({message: "reset success"});

  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: error.message, data: null });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { email } = req.body;
    const deactivatedUser = await userModel.findOneAndUpdate(
      { email },
      { $set: { isActive: false } },
      { new: true }
    );
    if (deactivatedUser) {
      return res.status(200).json({ message: "User deactivated successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
 
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};


