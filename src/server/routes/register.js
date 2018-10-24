import express from "express";

const app = express.Router();
app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    res.render('register', {
        errorMessage: req.flash('error')
    })
});
export default app;
