import express from "express";

const app = express.Router();

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    res.render(
        'login', {errorMessage: req.flash('error')}
    )
});

export default app
