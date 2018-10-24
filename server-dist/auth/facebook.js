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
  clientID: '301189910477524',
  clientSecret: '57834b06c058689a09df7bf6c34f0cb5',
  callbackURL: process.env.FACEBOOK_CALLBACK
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await _User.default.findOneAndUpdate({
      facebookId: profile.id
    }, {
      userName: profile.displayName
    }, {
      upsert: true
    }).exec();
    cb(null, user);
  } catch (err) {
    cb(err, {});
  }
}));

app.get('/auth/facebook', _passport.default.authenticate('facebook'));
app.get('/auth/facebook/callback', _passport.default.authenticate('facebook', {
  failureRedirect: '/login'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
var _default = app;
exports.default = _default;