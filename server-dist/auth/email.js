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

var _email = require("../util/email");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

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
    if (user.verified) {
      req.flash('error', "This email is taken");
      return res.redirect('/register');
    } else {
      req.flash('error', "Email verification needed. Please check your mailbox. Or login with this email and resend verification email.");
      return res.redirect('/register');
    }
  }

  const newUser = await _User.default.create({
    email,
    password,
    userName,
    emailVerified: false
  });
  req.login(newUser, async function (err) {
    if (err) {
      return next(err);
    }

    const template = await (0, _email.getHtmlTemplate)('confirmEmail');

    const token = _jsonwebtoken.default.sign({
      id: newUser._id
    }, 'hungrdeals');

    try {
      await (0, _email.sendEmail)({
        to: email,
        subject: 'Hungrdeals email verification',
        template: template({
          name: userName,
          activationLink: `${process.env.DOMAIN}/auth/email/confirm?token=${token}`
        })
      });
      res.redirect('/verification');
    } catch (e) {
      console.log(e);
      res.redirect('/verification');
    }
  });
});
app.get('/auth/email/confirm', async (req, res, next) => {
  const {
    token
  } = req.query;

  try {
    const decoded = _jsonwebtoken.default.verify(token, 'hungrdeals');

    await _User.default.update({
      _id: decoded.id
    }, {
      emailVerified: true
    });
    req.login({
      _id: decoded.id
    }, async function (err) {
      if (err) {
        return next(err);
      }

      res.redirect('/verification/done');
    });
  } catch (err) {
    res.text("Sth wrong happened");
  }
});
app.post('/auth/email', (0, _referer_path.getReferer)(), (req, res, next) => {
  _passport.default.authenticate('local', (err, user, info) => {
    if (err) {
      // 비밀번호 일치하지 않을 때
      console.log("Password not match");
      req.flash('error', "Password not match");
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
app.get('/verification', async (req, res) => {
  if (req.isAuthenticated()) {
    res.renderLogined('verification');
  } else {
    res.redirect('/login');
  }
});
app.get('/verification/done', async (req, res) => {
  if (req.isAuthenticated()) {
    res.renderLogined('verification-done');
  } else {
    res.render('verification-done');
  }
});
app.post('/verification/resend', async (req, res) => {
  if (req.isAuthenticated()) {
    const template = await (0, _email.getHtmlTemplate)('confirmEmail');

    const token = _jsonwebtoken.default.sign({
      id: req.user._id
    }, 'hungrdeals');

    await (0, _email.sendEmail)({
      to: req.user.email,
      subject: 'Hungrdeals email verification',
      template: template({
        name: req.user.userName,
        activationLink: `${process.env.DOMAIN}/auth/email/confirm?token=${token}`
      })
    });
    res.json({
      result: true
    });
  } else {
    res.json({
      err: "You should be logined to resend verification email"
    });
  }
});
var _default = app;
exports.default = _default;