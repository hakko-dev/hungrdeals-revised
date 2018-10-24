"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  if (!req.user.isAdmin) {
    return res.redirect('/');
  }

  next();
}

var _default = ensureAdmin;
exports.default = _default;