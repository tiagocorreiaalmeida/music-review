import express from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import passport from "passport";
import multer from "multer";
import mongo from "mongodb";
import { body, validationResult } from "express-validator/check";

import { smtpTransport, mailOptions } from "../controllers/nodeMailer";
import User from "../models/user";
import Post from "../models/post";
import auth from "../utils/auth";

const router = express.Router(),
    storage = multer.memoryStorage(),
    upload = multer({ storage }),
    { ObjectID } = mongo;

const encryptIt = password => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

router.post(
    "/register",
    [
        body("email")
            .exists()
            .isEmail()
            .withMessage("The email you have chosen is invalid!"),
        body("password")
            .trim()
            .isLength({ min: 4 })
            .withMessage("The password minimum length is 4 characters!"),
        body("username")
            .trim()
            .isLength({ min: 2 })
            .withMessage("The username minimum length is 2 characters!")
    ],
    async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) return res.error(409, errors.array()[0].msg);

            let email = req.body.email,
                password = encryptIt(req.body.password),
                username = req.body.username,
                activateKey = encryptIt(email + moment().valueOf());

            const dataAvaible = await User.findOne({
                $or: [{ email }, { username }]
            });
            if (dataAvaible && dataAvaible.email === email)
                return res.error(
                    409,
                    "The email you have chosen is already in use!"
                );
            if (dataAvaible && dataAvaible.username === username)
                return res.error(
                    409,
                    "The username you have chosen is already in use!"
                );

            await User.create({
                email,
                password,
                username,
                activateKey
            });

            let link = `http://localhost:3000/activate/${encodeURIComponent(
                activateKey
            )}`;
            /* 
            let link = `${req.protocol}://${req.get(
                "host"
            )}/activate/${activateKey}`; */

            smtpTransport.sendMail(
                mailOptions(email, "account activation", link),
                (err, info) => {
                    if (err) throw new Error(err);
                }
            );
        } catch (e) {
            res.error(
                500,
                "Something went wrong please refresh the page and try again",
                e
            );
        } finally {
            res.status(201).send();
        }
    }
);

router.get(/\/activate\/(.+)/, async (req, res) => {
    let activateKey = req.params[0];
    try {
        let user = await User.findOne({ activateKey });
        if (!user)
            return res.error(
                400,
                "Invalid key please verify that you have a valid link!"
            );

        await User.findByIdAndUpdate(user._id, {
            activateKey: "",
            active: true
        });
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.send();
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (!user || err) return res.error(401, "Your login failed!");
        if (user === "inactive")
            return res.error(409, "Please activate your account before!");
        req.logIn(user, e => {
            if (err) return res.error(401, "Your login failed!");
            delete user.password;
            delete user.active;
            delete user.activatekey;
            res.send(user);
        });
    })(req, res, next);
});

router.get("/logout", auth, (req, res) => {
    req.logOut();
    req.session.destroy();
    res.send();
});

router.patch("/update", auth, async (req, res) => {
    let userUpdates = {
            ...req.body
        },
        user;

    if (userUpdates.password) {
        delete userUpdates.password;
    } else if (userUpdates.avatar) {
        delete userUpdates.avatar;
    } else if (userUpdates.createdAt) {
        delete userUpdates.createdAt;
    }

    try {
        if (userUpdates.username) {
            if (userUpdates.username.length < 2)
                return res.error(
                    409,
                    "The username minimum length is 2 characters!"
                );
            let userNameExists = await User.findOne({
                _id: { $ne: req.user.id },
                username: userUpdates.username
            });
            if (userNameExists)
                return res.error(
                    401,
                    "The username you have chosen is already in use!"
                );

            user = await User.findByIdAndUpdate(req.user.id, userUpdates, {
                new: true
            });
        }
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.send(user);
    }
});

router.patch(
    "/update-password",
    auth,
    [
        body("password")
            .trim()
            .isLength({ min: 4 })
            .withMessage("The password minimum length is 4 characters!")
    ],
    async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) return res.error(409, errors.array()[0].msg);

            let password = encryptIt(req.body.password);
            await User.update({ _id: req.user.id }, { password });
            res.send();
        } catch (e) {
            res.error(
                500,
                "Something went wrong please refresh the page and try again",
                e
            );
        }
    }
);

router.patch("/avatar", upload.single("avatar"), auth, async (req, res) => {
    const file = req.file;
    if (!file)
        return res.error(409, "Upload an image before make the request!");
    if (file.size / 1000000 > 2)
        return res.error(
            409,
            "The avatar you have chosen exceeds the limit(2mb) size!"
        );
    if (
        file.mimetype.split("/")[1] !== "png" &&
        file.mimetype.split("/")[1] !== "jpeg"
    )
        return res.error(409, "The avatar you have chosen is invalid!");
    try {
        let user = await User.findByIdAndUpdate(
            req.user.id,
            {
                avatar: file.buffer.toString("base64")
            },
            { new: true }
        );
        res.send(user);
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    }
});

router.get("/info/:username", async (req, res) => {
    let username = req.params.username;
    let user;

    try {
        user = await User.findOne(
            { username, active: true },
            { username: 1, location: 1, avatar: 1, createdAt: 1 }
        );

        if (!user)
            return res.error(
                409,
                "Couldn't find the user you were looking for!"
            );
        res.send(user);
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    }
});

export default router;
