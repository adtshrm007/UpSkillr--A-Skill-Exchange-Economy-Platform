import express from "express";
const app = express();
app.use(express.json());
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser())
import { connectDB } from "./src/utils/connectDB.js";
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

import userRouter from "./src/routes/user.routes.js";
app.use("/user",userRouter);


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at ${port} and mongo connected`);
    });
  })
  .catch(() => {
    console.log("Error occured");
  });
