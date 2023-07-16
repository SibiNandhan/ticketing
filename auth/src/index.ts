import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  mongoose
    .connect(
      "mongodb+srv://sibi:qwertyuiop@cluster0.zrtqknl.mongodb.net/auth?retryWrites=true&w=majority"
    )
    .then((success) => {
      console.log("connected successfully");
      app.listen(3000, () => {
        console.log("Listening on port 3000!!!");
      });
    })
    .catch((err) => {
      console.log("ERROR", err.message);
    });
};

start();
