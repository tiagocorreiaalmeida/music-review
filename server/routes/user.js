import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import moment from "moment";
import passport from "passport";
import multer from "multer";

import User from "../models/user";
import auth from "../utils/auth";

const router = express.Router(),
    storage = multer.memoryStorage(),
    upload = multer({ storage });

const encryptIt = password => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

router.post("/register", async (req, res) => {
    let email = req.body.email,
        password = encryptIt(req.body.password),
        username = req.body.username,
        activateKey = encryptIt(email + moment().valueOf());

    if (!validator.isEmail(email))
        return res.error(409, "The email you have chosen is invalid!");

    try {
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

        //send email with activation link
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    } finally {
        res.status(201).send();
    }
});

router.get(/\/activate\/(.+)/, async (req, res) => {
    let activateKey = req.params[0];
    try {
        let user = await User.findOne({ activateKey });
        if (!user) return res.error(400, "invalid-link");

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

    try {
        if (userUpdates.username) {
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

router.patch("/update-password", auth, async (req, res) => {
    let password = encryptIt(req.body.password);
    try {
        await User.update({ _id: req.user.id }, { password });
        res.send();
    } catch (e) {
        res.error(
            500,
            "Something went wrong please refresh the page and try again",
            e
        );
    }
});

router.patch("/avatar", upload.single("avatar"), auth, async (req, res) => {
    const file = req.file;
    if (file.size / 1000000 > 4)
        return res.error(
            409,
            "The avatar you have chosen exceeds the limit size!"
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

export default router;
