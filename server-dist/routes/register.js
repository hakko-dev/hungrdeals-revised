"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('register', {
    errorMessage: req.flash('error')
  });
});
var _default = app;
exports.default = _default;