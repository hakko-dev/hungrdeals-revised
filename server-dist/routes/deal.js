"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/deal/:dealId', async (req, res) => {
  try {
    const deal = await _Deal.default.findOne({
      _id: req.params.dealId
    }).exec();

    if (!deal) {
      res.redirect('/');
      return;
    }

    const dealInfo = deal.getDealInfo();
    console.log(dealInfo);

    if (req.isAuthenticated()) {
      res.renderLogined('deal', { ...dealInfo
      });
    } else {
      res.render('deal', { ...dealInfo
      });
    }
  } catch (e) {
    res.redirect('/');
  }
});
var _default = app;
exports.default = _default;