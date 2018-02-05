export default (req, res, next) => {
    if (!req.isAuthenticated()) return res.error(401, "not-logged");
    next();
};
