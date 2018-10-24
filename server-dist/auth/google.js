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
  clientID: '1071149374337-c2hveca4v49j79fc6gc6m3itb6nljjn7.apps.googleusercontent.com',
  clientSecret: 'IQFvw3wtFggeSC9ppCwjnHP1',
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
  scope: ['profile']
}));
app.get('/auth/google/callback', _passport.default.authenticate('google', {
  failureRedirect: '/login'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
var _default = app;
exports.default = _default;