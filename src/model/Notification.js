import mongoose from "mongoose";
import { Post } from "./Post.js";
import { User } from "./User.js";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["newBid", "acceptBid"],
  },
  bidder: {
    type: String,
    ref: User,
  },
  bidAmt: {
    type: String,
  },
  post: {
    type: String,
    ref: Post,
  },
  guest: {
    type: String,
    ref: User,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
