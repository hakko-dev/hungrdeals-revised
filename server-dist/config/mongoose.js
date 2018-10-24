"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instance = exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.set('useFindAndModify', false);

var db = _mongoose.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("mongodb connected");
});

_mongoose.default.connect(process.env.MONGO_HOST, {
  useNewUrlParser: true
});

var _default = _mongoose.default;
exports.default = _default;
const instance = db;
exports.instance = instance;