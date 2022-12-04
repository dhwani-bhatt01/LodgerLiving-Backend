import express from "express";
import { Notification } from "../model/Notification.js";
import { User } from "../model/User.js";

export const notificationRouter = express.Router();

notificationRouter.get("/", async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id);

    if (user?.userType === "guest") {
      const notifications = await Notification.find({
        guest: { $eq: user?._id },
        type: "newBid",
      }).populate(["guest", "bidder"]);
      return res.status(200).send({ notifications });
    } else {
      const notifications = await Notification.find({
        bidder: { $eq: user?._id },
        type: "acceptBid",
      }).populate(["guest", "bidder"]);
      return res.status(200).send({ notifications });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
