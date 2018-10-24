"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _configure = require("./config/configure");

var _routes = _interopRequireDefault(require("./routes"));

var _auth = _interopRequireDefault(require("./auth"));

var _mongoose = _interopRequireDefault(require("./config/mongoose"));

var _User = _interopRequireDefault(require("./models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV === 'production') {// require('babel-polyfill')
}

const app = (0, _express.default)();

if (process.env.NODE_ENV === 'production') {
  app.use("/assets", _express.default.static(_path.default.join(__dirname, "../dist")));
} else {
  app.use("/assets", _express.default.static(_path.default.join(__dirname, "../../dist")));
}

(0, _configure.configureLogging)(app);
(0, _configure.configureCors)(app);
(0, _configure.configureBodyparser)(app);
(0, _configure.configureRedisSession)(app);
(0, _configure.configurePassport)(app);
(0, _configure.configureFlash)(app);
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(_auth.default); // 소셜 로그인

app.use(_routes.default);
app.listen(3000);