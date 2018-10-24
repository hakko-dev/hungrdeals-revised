function ensureAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    if(!req.user.isAdmin){
        return res.redirect('/')
    }
    next()
}

export default ensureAdmin;
