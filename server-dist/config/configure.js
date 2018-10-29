"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureRedisSession = configureRedisSession;
exports.configureLogging = configureLogging;
exports.configureCors = configureCors;
exports.configureBodyparser = configureBodyparser;
exports.configurePassport = configurePassport;
exports.configureFlash = configureFlash;

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectRedis = _interopRequireDefault(require("connect-redis"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _User = _interopRequireDefault(require("../models/User"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// use redis as session storage
const RedisStore = (0, _connectRedis.default)(_expressSession.default);

function configureRedisSession(app) {
  const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_SECRET
  } = process.env;
  app.use((0, _expressSession.default)({
    store: new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT
    }),
    secret: REDIS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 315360000000
    }
  }));
  app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("redis connection failure")); // handle error
    }

    next(); // otherwise continue
  });
} // logging setting


function configureLogging(app) {
  app.use((0, _morgan.default)((tokens, req, res) => {
    return [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens.res(req, res, "content-length"), "-", tokens["response-time"](req, res), "ms"].join(" ");
  }));
} // cors setting


function configureCors(app) {
  app.use((0, _cors.default)());
} // bodyparser setting


function configureBodyparser(app) {
  app.use(_bodyParser.default.json());
  app.use(_bodyParser.default.urlencoded({
    extended: true
  }));
}

function configurePassport(app) {
  app.use(_passport.default.initialize());
  app.use(_passport.default.session());

  _passport.default.serializeUser((user, done) => {
    done(null, {
      _id: user._id
    });
  });

  _passport.default.deserializeUser(async (obj, done) => {
    const user = await _User.default.findOne({
      _id: obj._id
    }).exec();
    done(null, user);
  });
}

function configureFlash(app) {
  app.use((0, _connectFlash.default)());
}