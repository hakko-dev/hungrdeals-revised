"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

_passport.default.use(new _passportFacebook.default({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEOOK_CLIENT_KEY,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await _User.default.findOneAndUpdate({
      facebookId: profile.id
    }, {
      email: profile.emails !== undefined ? profile.emails[0].value : null,
      userName: profile.displayName
    }, {
      upsert: true
    }).exec();
    cb(null, user);
  } catch (err) {
    cb(err, {});
  }
}));

app.get('/auth/facebook', _passport.default.authenticate('facebook', {
  scope: ['email']
}));
app.get('/auth/facebook/callback', _passport.default.authenticate('facebook', {
  failureRedirect: '/login'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
var _default = app;
exports.default = _default;