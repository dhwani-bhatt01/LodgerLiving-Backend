import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password, userType, hotelName, pgName } = req.body;

  if (name === "" || email === "" || password === "" || userType === "")
    return res.status(400).send({
      message: "Data incomplete",
    });

  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(400).send({
      message: "Email already exists",
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    userType,
    hotelName,
    pgName,
  });
  try {
    const savedUser = await user.save();
    res.send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        hotelName: user.hotelName,
        pgName: user.pgName,
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

authRouter.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email }).lean();
  if (!existingUser)
    return res.status(400).send({
      message: "User doesn't exists.",
    });

  const validPass = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!validPass)
    return res.status(400).send({
      message: "Incorrect Password",
    });

  const token = jwt.sign({ _id: existingUser._id }, process.env.TOKEN_SECRET);
  delete existingUser.password;
  res.status(200).send({
    token,
    user: existingUser,
  });
});
