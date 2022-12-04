import express from "express";
import { Post } from "../model/Post.js";
import { User } from "../model/User.js";

export const profileRouter = express.Router();

profileRouter.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.userType === "guest") {
      const posts = await Post.find({ user: { $eq: user._id } });
      return res.status(200).send({ posts });
    } else {
      const posts = await Post.find({ "bids.bidder": user._id });
      return res.status(200).send({ posts });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
