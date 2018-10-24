import express from "express";
import passport from 'passport'
import FacebookStrategy from 'passport-facebook'
import User from '../models/User'

const app = express.Router();

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEOOK_CLIENT_KEY,
        callbackURL: process.env.FACEBOOK_CALLBACK
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const user = await User.findOneAndUpdate({facebookId: profile.id}, {userName: profile.displayName}, {upsert: true}).exec()
            cb(null, user);
        } catch (err) {
            cb(err, {});
        }
    }
));

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

export default app;
