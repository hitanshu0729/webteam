import mongoose from "mongoose";
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection Successful");
  })
  .catch(() => {
    console.log("no connection");
  });
