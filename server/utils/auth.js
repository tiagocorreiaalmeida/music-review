export default (req, res, next) => {
    if (!req.isAuthenticated())
        return res.error(401, "Login in order to make changes");
    next();
};
