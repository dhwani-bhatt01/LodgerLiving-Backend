import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  hotelName: {
    type: String,
  },
  pgName: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
