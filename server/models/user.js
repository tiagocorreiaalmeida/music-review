import mongoose from "mongoose";
import moment from "moment";

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
        data: Buffer,
        contentType: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: moment().valueOf()
    }
});

const User = mongoose.model("User", UserSchema);

export default User;
