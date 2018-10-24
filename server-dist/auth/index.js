"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _facebook = _interopRequireDefault(require("./facebook"));

var _google = _interopRequireDefault(require("./google"));

var _email = _interopRequireDefault(require("./email"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.use(async (req, res, next) => {
  // 로그인 되어있다면 유저 정보 같이 가져옴
  if (req.isAuthenticated()) {
    res.renderLogined = (route, data) => {
      res.render(route, { ...data,
        ...{
          user: req.user.getProfile()
        }
      });
    };
  }

  next();
});
app.use(_facebook.default);
app.use(_google.default);
app.use(_email.default);
app.get('/logout', async (req, res) => {
  req.logout();
  res.redirect("/");
});
var _default = app;
exports.default = _default;