import mongoose from "mongoose";
import moment from "moment";

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        maxLength: 140,
        required: true,
        trim: true,
        unique: true
    },
    review: {
        type: String,
        minLength: 100,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    artists: [
        {
            name: {
                type: String
            },
            link: {
                type: String
            }
        }
    ],
    albumName: {
        type: String,
        required: true
    },
    albumLink: {
        type: String
    },
    albumCover: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    createdAt: {
        type: String,
        default: moment().valueOf()
    }
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
