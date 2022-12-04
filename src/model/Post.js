import mongoose from "mongoose";
import { User } from "./User.js";

const postSchema = new mongoose.Schema({
  // Common
  user: { type: String, ref: User },
  postType: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  budget: {
    type: [
      {
        type: String,
      },
    ],
    required: true,
  },
  amenities: {
    type: [
      {
        type: String,
      },
    ],
    required: true,
  },
  bids: [
    {
      bidAmt: String,
      bidder: { type: String, ref: User },
    },
  ],

  // Hotel
  occupancy: {
    type: String,
  },
  guests: {
    type: String,
  },
  acPreference: {
    type: String,
  },

  // Pg
  gender: {
    type: String,
  },
  roomType: {
    type: String,
  },
  furnishStatus: {
    type: String,
  },
});

export const Post = mongoose.model("Post", postSchema);
