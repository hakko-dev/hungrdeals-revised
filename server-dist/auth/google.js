"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth20"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

_passport.default.use(new _passportGoogleOauth.default({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_KEY,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const {
      id: googleId,
      displayName: userName,
      photos: photos,
      gender: gender
    } = profile;
    let profileImage;

    if (photos.length !== 0) {
      profileImage = photos[0].value;
    }

    const user = await _User.default.findOneAndUpdate({
      googleId
    }, {
      email: profile.emails[0].value,
      userName,
      profileImage,
      gender
    }, {
      upsert: true
    }).exec();
    cb(null, user);
  } catch (err) {
    cb(err, {});
  }
}));

app.get('/auth/google', _passport.default.authenticate('google', {
  scope: ['profile', 'email']
}));
app.get('/auth/google/callback', _passport.default.authenticate('google', {
  failureRedirect: '/login'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
var _default = app;
exports.default = _default;