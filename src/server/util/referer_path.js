import { URL } from "url";

function pathExtractor(req) {
  if (!req.headers.referer) {
    return false;
  }
  const url = new URL(req.headers.referer);
  return url.pathname;
}

export function checkRefererAndRedirect(fromPath, redirectPath) {
  return (req, res, next) => {
    if (pathExtractor(req) !== fromPath) {
      return res.redirect(redirectPath);
    }
    next();
  };
}

export function getReferer() {
  return (req, res, next) => {
    req.refererPath = pathExtractor(req);
    next();
  };
}
export default pathExtractor;
