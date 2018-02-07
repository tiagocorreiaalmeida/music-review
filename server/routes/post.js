import express from "express";
import { body, validationResult } from "express-validator/check";

import auth from "../utils/auth";
import Post from "../models/post";

const router = express.Router();

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
        let savedPost;
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

            savedPost = await Post.create(post);
        } catch (e) {
            res.error(
                500,
                "Something went wrong please refresh the page and try again",
                e
            );
        } finally {
            res.send(savedPost);
        }
    }
);

export default router;
