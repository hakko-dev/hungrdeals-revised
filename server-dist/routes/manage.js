"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/manage', async (req, res) => {
  if (req.isAuthenticated()) {
    const deals = await _Deal.default.find({
      author: req.user._id,
      deletedAt: {
        $exists: false
      }
    }).sort({
      createdAt: -1
    });
    const dealList = deals.map(deal => {
      return {
        createdAt: new Date(deal.createdAt),
        title: deal.title,
        deleteAuto: deal.deleteAuto,
        _id: deal._id
      };
    }).reduce((accumulator, item) => {
      const index = (item.createdAt.getMonth() + 1).toString() + '-' + item.createdAt.getFullYear().toString();

      if (accumulator.findIndex(item => {
        return item.time === index;
      }) === -1) {
        accumulator.push({
          time: index,
          items: []
        });
      }

      accumulator[accumulator.findIndex(item => {
        return item.time === index;
      })].items.push(item);
      return accumulator;
    }, []);
    console.log(JSON.stringify(dealList));
    res.renderLogined('manage', {
      dealList
    });
  } else {
    res.redirect('/login');
  }
});
var _default = app;
exports.default = _default;