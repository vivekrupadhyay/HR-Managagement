"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
const userModel = mongoose.model("User", userSchema);
exports.default = userModel;
