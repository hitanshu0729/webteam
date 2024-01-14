import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017/webt")
  .then(() => {
    console.log("MongoDB connection Successful");
  })
  .catch(() => {
    console.log("no connection");
  });
