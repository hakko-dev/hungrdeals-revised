"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User"));

var _email = require("../util/email");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/auth/password', async (req, res) => {
  res.render('find-password', {
    errMsg: req.flash('errMsg')
  });
});
app.post('/auth/password', async (req, res) => {
  const {
    email
  } = req.body;

  try {
    const user = await _User.default.findOne({
      email
    }).exec();

    if (!user) {
      req.flash('errMsg', 'No user with this email');
      return res.redirect('/auth/password');
    }

    if (user.getRegisterType() === 'FACEBOOK') {
      req.flash('errMsg', 'Please login with facebook');
      return res.redirect('/auth/password');
    }

    if (user.getRegisterType() === 'GOOGLE') {
      req.flash('errMsg', 'Please login with google');
      return res.redirect('/auth/password');
    }

    const template = await (0, _email.getHtmlTemplate)('passwordFind');

    const token = _jsonwebtoken.default.sign({
      id: user._id
    }, 'hungrdeals');

    await (0, _email.sendEmail)({
      to: email,
      subject: 'Reset Password',
      template: template({
        name: user.userName,
        resetLink: `${process.env.DOMAIN}/auth/password/reset?token=${token}`
      })
    });
    res.render('find-password-done');
  } catch (e) {
    console.log(e);
    res.render('find-password-done');
  }
});
app.get('/auth/password/reset', async (req, res) => {
  const {
    token
  } = req.query;

  try {
    const decoded = _jsonwebtoken.default.verify(token, 'hungrdeals');

    res.render('reset-password', {
      token
    });
  } catch (err) {
    res.send("Wrong access");
  }
});
app.post('/auth/password/reset', async (req, res) => {
  const {
    password,
    token
  } = req.body;

  try {
    const decoded = _jsonwebtoken.default.verify(token, 'hungrdeals');

    await _User.default.update({
      _id: decoded.id
    }, {
      password
    });
    res.redirect('/login');
  } catch (err) {
    res.send("Wrong access");
  }
});
var _default = app;
exports.default = _default;