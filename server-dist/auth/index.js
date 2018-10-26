"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _facebook = _interopRequireDefault(require("./facebook"));

var _google = _interopRequireDefault(require("./google"));

var _email = _interopRequireDefault(require("./email"));

var _password = _interopRequireDefault(require("./password"));

var _User = _interopRequireDefault(require("../models/User"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

// filling default meta tags
app.use((req, res, next) => {
  // grab reference of render
  const _render = res.render; // override logic

  res.render = function (view, options, fn) {
    // do some custom logic
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    options = _lodash.default.extend({
      meta: {
        title: 'Hungrdeals - The ultimate food finder',
        description: 'Hungry for deals nearby? Seize your wallet & get on Hungerdeals! At one click away, Australia’s #1 affordable food catalogue will ease your day.',
        url: fullUrl,
        image: process.env.DOMAIN + '/assets/5cae799e09ba9df684d89c32e9780ada.jpg'
      },
      ...options
    }); // continue with original render

    _render.call(this, view, options, fn);
  };

  next();
});
app.use(async (req, res, next) => {
  // 로그인 되어있다면 유저 정보 같이 가져옴
  if (req.isAuthenticated()) {
    res.renderLogined = (route, data) => {
      res.render(route, { ...data,
        ...{
          user: req.user.getProfile(),
          isAdmin: req.user.isAdmin
        }
      });
    };
  }

  next();
});
app.use(_facebook.default);
app.use(_google.default);
app.use(_email.default);
app.use(_password.default);
app.get('/logout', async (req, res) => {
  req.logout();
  res.redirect("/");
});
app.get('/auth/withdraw', async (req, res) => {
  await _User.default.deleteOne({
    _id: req.user._id
  }).exec();
  await _Deal.default.deleteMany({
    author: req.user._id
  }).exec();
  req.logout();
  res.redirect('/');
});
var _default = app;
exports.default = _default;