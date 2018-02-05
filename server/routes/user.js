import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import moment from "moment";
import passport from "passport";

import User from "../models/user";
import auth from "../utils/auth";

const router = express.Router();

const encryptIt = password => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

router.post("/register", async (req, res) => {
    let email = req.body.email,
        password = encryptIt(req.body.password),
        username = req.body.username,
        activateKey = encryptIt(email + moment().valueOf());

    if (!validator.isEmail(email)) return res.error(409, "invalid-email");

    try {
        const dataAvaible = await User.findOne({
            $or: [{ email }, { username }]
        });
        console.log(dataAvaible);
        if (dataAvaible && dataAvaible.email === email)
            return res.error(409, "email-exists");
        if (dataAvaible && dataAvaible.username === username)
            return res.error(409, "username-exists");

        await User.create({
            email,
            password,
            username,
            activateKey
        });

        //send email with activation link
    } catch (e) {
        res.error(500, "unexpected-error", e);
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
        res.error(500, "unexpected-error", e);
    } finally {
        res.send();
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (!user || err) return res.error(401, "login-failed");
        if (user === "inactive") return res.error(409, "active-account");
        req.logIn(user, e => {
            if (err) return res.error(401, "login-failed");
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
            if (userNameExists) return res.error(401, "username-exists");

            user = await User.findByIdAndUpdate(req.user.id, userUpdates, {
                new: true
            });
        }
    } catch (e) {
        res.error(500, "unexpected-error", e);
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
        res.error(500, "unexpected-error", e);
    }
});

export default router;
