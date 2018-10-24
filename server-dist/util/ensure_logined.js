"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ensureLogined(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  next();
}

var _default = ensureLogined;
exports.default = _default;