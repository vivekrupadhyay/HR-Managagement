import * as mongoose from "mongoose";
import User from "../interfaces/user.interface";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "guest", "admin"],
  },
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
