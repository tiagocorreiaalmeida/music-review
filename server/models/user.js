import mongoose from "mongoose";
import moment from "moment";
import fs from "fs";
import path from "path";

const defaultAvatar = fs.readFileSync(path.join(process.cwd(), "media", "user.png"), "base64");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        minLength: 4,
        unique: true,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    activateKey: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: defaultAvatar
    },
    createdAt: {
        type: String,
        default: moment().valueOf()
    }
});

const User = mongoose.model("User", UserSchema);

export default User;
