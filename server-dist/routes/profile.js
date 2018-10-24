"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

var _s = require("../util/s3");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/profile', _ensure_logined.default, (req, res) => {
  const registerType = req.user.getRegisterType();
  res.renderLogined('profile', {
    isEmail: registerType === 'EMAIL',
    isFacebook: registerType === 'FACEBOOK',
    isGoogle: registerType === 'GOOGLE'
  });
});
app.post('/profile', _ensure_logined.default, _s.upload.single('profileImage'), async (req, res) => {
  const {
    userName,
    password,
    passwordNew
  } = req.body;
  const file = req.file;
  const updateCriteria = {
    userName
  };

  if (file) {
    // profile image sent
    updateCriteria.profileImage = file.location;
  }

  if (password && passwordNew && password === req.user.password && passwordNew && passwordNew !== '') {
    updateCriteria.password = passwordNew;
  }

  await req.user.update(updateCriteria);
  res.send('ok');
});
var _default = app;
exports.default = _default;