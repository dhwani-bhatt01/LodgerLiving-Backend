import express from "express";
import { Notification } from "../model/Notification.js";
import { Post } from "../model/Post.js";

export const postRouter = express.Router();

postRouter.post("/", async (req, res) => {
  const { values } = req.body;

  try {
    if (
      values.postType !== "" ||
      values.location !== "" ||
      values.budget !== [] ||
      values.amenities !== []
    ) {
      switch (values.postType) {
        case "hotel":
          if (
            values.occupancy !== "" ||
            values.guests !== "" ||
            values.acPreference !== ""
          ) {
            const newPost = new Post({
              user: req?.user?._id,
              acPreference: values.acPreference,
              amenities: values.amenities,
              budget: values.budget,
              location: values.location,
              postType: values.postType,
              guests: values.guests,
              occupancy: values.occupancy,
            });
            await newPost.save();
            return res.status(200).send({
              message: "Post added",
            });
          } else
            return res.status(400).send({
              message: "Data incomplete",
            });
        case "pg":
          if (
            values.gender !== "" ||
            values.roomType !== "" ||
            values.furnishStatus !== ""
          ) {
            const newPost = new Post({
              user: req?.user?._id,
              amenities: values.amenities,
              budget: values.budget,
              location: values.location,
              postType: values.postType,
              furnishStatus: values.furnishStatus,
              gender: values.gender,
              roomType: values.roomType,
            });
            await newPost.save();
            return res.status(200).send({
              message: "Post added",
            });
          } else
            return res.status(400).send({
              message: "Data incomplete",
            });
      }
    } else {
      return res.status(400).send({
        message: "Data incomplete",
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

postRouter.get("/hotel", async (req, res) => {
  try {
    const posts = await Post.find({ postType: { $eq: "hotel" } });
    return res.status(200).send({
      posts,
    });
  } catch (err) {
    return res.status(200).send({
      message: "Something went wrong",
    });
  }
});

postRouter.get("/pg", async (req, res) => {
  try {
    const posts = await Post.find({ postType: { $eq: "pg" } });
    return res.status(200).send({
      posts,
    });
  } catch (err) {
    return res.status(200).send({
      message: "Something went wrong",
    });
  }
});

postRouter.post("/bid", async (req, res) => {
  const { bidAmt, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    const hasPrevBid = post.bids.find((b) => b.bidder === req?.user?._id);
    if (hasPrevBid) {
      return res.status(400).send({
        message: "You already made a bid...",
      });
    } else {
      post.bids.push({ bidAmt, bidder: req?.user?._id });
      await post.save();

      const newNotif = new Notification({
        bidAmt,
        type: "newBid",
        post: post?._id,
        bidder: req?.user?._id,
        guest: post?.user,
      });
      await newNotif.save();

      return res.status(200).send({
        message: "Bid added successfully",
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: "Something went wrong",
    });
  }
});

postRouter.post("/bid-accept", async (req, res) => {
  const { bidderId, postId, bidAmt } = req.body;
  try {
    const existingNotification = await Notification.find({
      type: "acceptBid",
      post: postId,
    });
    if (existingNotification.length >= 1) {
      return res.status(400).send({ message: "You can only accept one bid" });
    } else {
      const newNotif = new Notification({
        bidAmt,
        type: "acceptBid",
        bidder: bidderId,
        post: postId,
        guest: req?.user?._id,
      });
      await newNotif.save();
      return res.status(200).send({ message: "Bid accepted successfully" });
    }
  } catch (err) {
    return res.status(400).send({
      message: "Something went wrong",
    });
  }
});
