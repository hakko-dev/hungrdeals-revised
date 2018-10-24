"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ensure_admin = _interopRequireDefault(require("../util/ensure_admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/admin', _ensure_admin.default, (req, res) => {
  res.renderLogined('admin-unverified');
});
var _default = app;
exports.default = _default;