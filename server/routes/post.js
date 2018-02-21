import express from "express";
import mongo from "mongodb";
import { body, validationResult } from "express-validator/check";

import auth from "../utils/auth";
import Post from "../models/post";
import User from "../models/user";

const router = express.Router(),
    { ObjectID } = mongo;

router.post(
    "/",
    auth,
    [
        body("title")
            .trim()
            .isLength({ min: 3 })
            .withMessage("The title minimum length is 3 characters!")
            .isLength({ max: 140 })
            .withMessage("The title maximum length is 140 characters!"),
        body("review")
            .trim()
            .isLength({ min: 100 })
            .withMessage("The review minimum length is 100 characters!"),
        body("albumName")
            .exists()
            .withMessage("The album name is missing!"),
        body("albumLink")
            .exists()
            .withMessage("The album link is missing!")
    ],
    async (req, res) => {
        let newPost;
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) return res.error(409, errors.array()[0].msg);

            let post = {
                ...req.body,
                author: req.user.id
            };

            let titleExists = await Post.findOne({ title: post.title });
            if (titleExists)
                return res.error(
                    409,
                    "The title you have chosen is already in use!"
                );

            await Post.create(post);
            newPost = await Post.findOne({ title: post.title }).populate(
                "author",
                "username"
            );
        } catch (e) {
            res.error(
                500,
                "Something went wrong please refresh the page and try again",
                e
            );
        } finally {
            res.send(newPost);
        }
    }
);

router.delete("/:id", auth, async (req, res) => {
    let postID = req.params.id;
    if (!ObjectID.isValid(postID))
        return res.error(409, "Invalid data submitted!");
    try {
        let postExists = await Post.findOne({
            _id: postID,
            author: req.user.id
        });
        if (!postExists)
            return res.error(
                409,
                "The post you tried to delete doesn't exists!"
            );

        await Post.remove({ _id: postID });
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.send(200);
    }
});

router.patch("/:id", auth, async (req, res) => {
    let postID = req.params.id;
    if (!ObjectID.isValid(postID))
        return res.error(409, "Invalid data submitted!");
    let post;
    try {
        let postUpdates = {
            ...req.body
        };

        if (postUpdates.title) {
            postUpdates.title = postUpdates.title.trim();
            if (postUpdates.title.length > 140)
                return res.error(
                    409,
                    "The title maximum length is 140 characters!"
                );
            if (postUpdates.title.length < 3)
                return res.error(
                    409,
                    "The title minimum length is 3 characters!"
                );
        }

        if (postUpdates.review) {
            postUpdates.review = postUpdates.review.trim();
            if (postUpdates.review.length < 100)
                return res.error(
                    409,
                    "The review minimum length is 100 characters!"
                );
        }

        let postExists = await Post.findOne({
            author: req.user.id,
            _id: postID
        });

        if (!postExists)
            return res.error(
                409,
                "The post you are trying to update doesn't exists!"
            );

        if (
            (postExists.likes.length > 0 && postUpdates.albumName) ||
            (postExists.likes.length > 0 && postUpdates.albumLink)
        )
            return res.error(
                409,
                "You can't change the album content after someone liking your content!"
            );

        let titleExists = await Post.findOne({
            _id: { $ne: postID },
            title: postUpdates.title
        });

        if (titleExists)
            return res.error(
                409,
                "The title you have chosen is already in use!"
            );

        if (postUpdates.author) {
            delete postUpdates.author;
        } else if (postUpdates.likes) {
            delete postUpdates.likes;
        } else if (postUpdates.createdAt) {
            delete postUpdates.createdAt;
        }

        post = await Post.findByIdAndUpdate(postID, postUpdates, {
            new: true
        }).populate("author", "username");
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.send(post);
    }
});

router.patch("/like/:id", auth, async (req, res) => {
    let postID = req.params.id;
    if (!ObjectID.isValid(postID))
        return res.error(409, "Invalid data submitted!");
    let updatedPost;
    try {
        let post = await Post.findById(postID);
        if (!post)
            return res.error(
                409,
                "The post you are trying to like doesn't exist!"
            );
        let updates;
        if (!post.likes.includes(req.user.id)) {
            updates = { $push: { likes: req.user.id } };
        } else {
            updates = { $pull: { likes: req.user.id } };
        }
        updatedPost = await Post.findByIdAndUpdate(postID, updates, {
            new: true
        });
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.send(updatedPost.likes);
    }
});

router.get("/", async (req, res) => {
    let skip = parseInt(req.query.skip) || 0,
        userID = req.query.userid,
        sort =
            req.query.sort === "likes" ? { likes: "-1" } : { createdAt: "-1" };
    let searchQuery = { author: userID || "" };
    try {
        let posts = await Post.find()
            .sort(sort)
            .skip(skip)
            .limit(4)
            .populate("author", "username");
        res.send(posts);
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    }
});

export default router;
