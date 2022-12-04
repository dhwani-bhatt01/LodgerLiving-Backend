import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.controller.js";
import { notificationRouter } from "./routes/notification.controller.js";
import { postRouter } from "./routes/post.controller.js";
import { profileRouter } from "./routes/profile.controller.js";
import { verifyAuthToken } from "./utils/verifyToken.js";
const app = express(); //created an instance of express

dotenv.config(); //setup .env

//connect to mongodb
mongoose
	.connect(process.env.DB_CONNECT)
	.then(() => console.log("connected to db")) //log a msg when connection is completed
	.catch((err) => console.log(err)); //print any errors

app.get("/", async (req, res) => {
	res.send("Hy! API is working");
});

//middlewares
app.use(cors()); //using cors middleware for accessing data from any origin
app.use(express.json()); //use json data in server

app.use("/api/auth", authRouter); //auth routes
app.use("/api/posts", verifyAuthToken, postRouter);
app.use("/api/notifications", verifyAuthToken, notificationRouter);
app.use("/api/profile", verifyAuthToken, profileRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));
