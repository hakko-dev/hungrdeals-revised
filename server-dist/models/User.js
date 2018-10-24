"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("../config/mongoose"));

var _mongooseCreatedatUpdatedat = _interopRequireDefault(require("mongoose-createdat-updatedat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const userSchema = new Schema({
  userName: String,
  facebookId: String,
  googleId: String,
  email: String,
  password: String,
  profileImage: String,
  gender: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.plugin(_mongooseCreatedatUpdatedat.default);

userSchema.methods.getRegisterType = function () {
  if (this.facebookId) {
    return 'FACEBOOK';
  } else if (this.googleId) {
    return 'GOOGLE';
  } else {
    return 'EMAIL';
  }
};

userSchema.methods.getProfile = function () {
  return {
    userId: this._id,
    userName: this.userName,
    email: this.email,
    profileImage: this.profileImage || 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
  };
};

const User = _mongoose.default.model('User', userSchema);

var _default = User;
exports.default = _default;