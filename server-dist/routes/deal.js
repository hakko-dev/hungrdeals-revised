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
    const meta = {
      meta: {
        title: 'Hungrdeals - ' + dealInfo.title,
        description: `[${dealInfo.category} / ${dealInfo.cuisineType}] ${dealInfo.description_raw}`,
        image: dealInfo.images && dealInfo.images.length !== 0 ? dealInfo.images[0] : process.env.DOMAIN + '/assets/5cae799e09ba9df684d89c32e9780ada.jpg'
      }
    };

    if (req.isAuthenticated()) {
      res.renderLogined('deal', { ...dealInfo,
        ...meta
      });
    } else {
      res.render('deal', { ...dealInfo,
        ...meta
      });
    }
  } catch (e) {
    res.redirect('/');
  }
});
var _default = app;
exports.default = _default;