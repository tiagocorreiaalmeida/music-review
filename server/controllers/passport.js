import local from "passport-local";
import bcrypt from "bcrypt";

import User from "../models/user";

const LocalStrategy = local.Strategy;

export default passport => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async (username, password, done) => {
                try {
                    let user = await User.findOne({ email: username });
                    if (
                        user &&
                        bcrypt.compareSync(password, user.password) &&
                        user.active
                    ) {
                        done(null, user);
                    } else if (user && !user.active) {
                        done(null, "inactive");
                    } else {
                        done(null, false);
                    }
                } catch (e) {
                    res.error(500, "unexpected-error", e);
                }
            }
        )
    );

    passport.serializeUser((user, cb) => cb(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id, { _id: 1, username: 1 });
        done(null, user);
    });
};
