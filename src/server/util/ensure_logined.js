function ensureLogined(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    // if (req.user.emailVerified === false) {
    //     return res.redirect("/verification");
    // }
    next()
}

export default ensureLogined;
