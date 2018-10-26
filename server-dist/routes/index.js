"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _profile = _interopRequireDefault(require("./profile"));

var _register = _interopRequireDefault(require("./register"));

var _main = _interopRequireDefault(require("./main"));

var _login = _interopRequireDefault(require("./login"));

var _deal = _interopRequireDefault(require("./deal"));

var _sell = _interopRequireDefault(require("./sell"));

var _api = _interopRequireDefault(require("./api"));

var _about = _interopRequireDefault(require("./about"));

var _manage = _interopRequireDefault(require("./manage"));

var _help = _interopRequireDefault(require("./help"));

var _term = _interopRequireDefault(require("./term"));

var _policy = _interopRequireDefault(require("./policy"));

var _admin = _interopRequireDefault(require("./admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.use(_profile.default);
app.use(_register.default);
app.use(_main.default);
app.use(_login.default);
app.use(_deal.default);
app.use(_sell.default);
app.use(_api.default);
app.use(_about.default);
app.use(_manage.default);
app.use(_help.default);
app.use(_term.default);
app.use(_policy.default);
app.use(_admin.default);
var _default = app;
exports.default = _default;