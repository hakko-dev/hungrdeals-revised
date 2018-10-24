import express from "express";
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import User from '../models/User'

const app = express.Router();

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_KEY,
        callbackURL: process.env.GOOGLE_CALLBACK
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const {
                id : googleId,
                displayName: userName,
                photos: photos,
                gender: gender,
            } = profile
            let profileImage;
            if(photos.length !== 0){
                profileImage = photos[0].value
            }
            const user = await User.findOneAndUpdate({googleId}, {userName, profileImage, gender}, {upsert: true}).exec()
            cb(null, user);
        } catch (err) {
            cb(err, {});
        }
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

export default app;
