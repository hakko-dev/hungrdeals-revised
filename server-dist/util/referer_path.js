"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRefererAndRedirect = checkRefererAndRedirect;
exports.getReferer = getReferer;
exports.default = void 0;

var _url = require("url");

function pathExtractor(req) {
  if (!req.headers.referer) {
    return false;
  }

  const url = new _url.URL(req.headers.referer);
  return url.pathname;
}

function checkRefererAndRedirect(fromPath, redirectPath) {
  return (req, res, next) => {
    if (pathExtractor(req) !== fromPath) {
      return res.redirect(redirectPath);
    }

    next();
  };
}

function getReferer() {
  return (req, res, next) => {
    req.refererPath = pathExtractor(req);
    next();
  };
}

var _default = pathExtractor;
exports.default = _default;