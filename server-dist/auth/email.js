"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _User = _interopRequireDefault(require("../models/User"));

var _referer_path = require("../util/referer_path");

var _validator = _interopRequireDefault(require("validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

_passport.default.use(new _passportLocal.default({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, cb) => {
  try {
    // 이미 가입된 유저가 있는지 확인
    const user = await _User.default.findOne({
      email
    }).exec();

    if (user) {
      // 가입된 유저가 있다면
      // 비번 맞는지 확인
      if (user.password === password) {
        // 비밀번호가 일치 한다면
        cb(null, user);
      } else {
        cb(new Error("Password Not Match"), {});
      }
    } else {
      // 가입된 유저가 없다면
      cb(new Error("No account with this email"), {});
    }
  } catch (err) {
    cb(err, {});
  }
}));

app.post('/register/email', async (req, res, next) => {
  const {
    email,
    password,
    username: userName
  } = req.body;

  const v_email = _validator.default.isEmail(email);

  if (!v_email) {
    req.flash('error', "Email should be in email format");
    return res.redirect('/register');
  }

  if (password === '') {
    req.flash('error', "Password is empty");
    return res.redirect('/register');
  }

  const user = await _User.default.findOne({
    email
  }).exec();

  if (user) {
    req.flash('error', "This email is taken");
    return res.redirect('/register');
  }

  const newUser = await _User.default.create({
    email,
    password,
    userName
  });
  req.login(newUser, function (err) {
    if (err) {
      return next(err);
    }

    return res.redirect('/');
  });
});
app.post('/auth/email', (0, _referer_path.getReferer)(), (req, res, next) => {
  _passport.default.authenticate('local', (err, user, info) => {
    if (err) {
      // 비밀번호 일치하지 않을 때
      req.flash('error', err.message);
      return res.redirect(req.refererPath);
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });
  })(req, res, next);
});
var _default = app;
exports.default = _default;