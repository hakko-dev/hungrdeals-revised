"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    res.renderLogined('main', {
      mainPage: true,
      path: null
    });
  } else {
    res.render('main', {
      mainPage: true,
      path: null
    });
  }
});
const BIG_CATEGORY = ['Weekday Specials', 'Weekend Deals', 'Happy Hour', 'Combo', 'Miscellaneous', 'Menus'];
const SUB_CATEGORY = ['All Weekday Specials', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'All Weekend Deals', 'Saturday', 'Sunday', 'All Happy Hours', 'All Combos', 'All Miscellaneous', 'Grand Openings', 'Homemade Meals', 'Volunteer', 'Giveaway', 'Buffet', 'All Menus', 'Restaurant', 'Bar', 'Cafe'];
app.get('/:bigCategory/:subCategory', async (req, res, next) => {
  const {
    bigCategory,
    subCategory
  } = req.params;
  if (BIG_CATEGORY.indexOf(bigCategory) === -1 || SUB_CATEGORY.indexOf(subCategory) === -1) return next();

  if (req.isAuthenticated()) {
    res.renderLogined('main', {
      mainPage: true,
      path: {
        big: bigCategory,
        sub: subCategory
      }
    });
  } else {
    res.render('main', {
      mainPage: true,
      path: {
        big: bigCategory,
        sub: subCategory
      }
    });
  }
});
var _default = app;
exports.default = _default;