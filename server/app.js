import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import mongoose from "./config/mongoose";
import errorHandler from "./utils/errorHandler";
import passportConfig from "./controllers/passport";
import user from "./routes/user";
import spotify from "./routes/spotify";
import post from "./routes/post";

const app = express(),
    port = process.env.PORT || 3000;

passportConfig(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.options("*", cors());

app.use(errorHandler);

app.use("/api/user", user);
app.use("/api/spotify", spotify);
app.use("/api/post", post);

app.listen(port, () => console.log(`Running on port ${port}`));
