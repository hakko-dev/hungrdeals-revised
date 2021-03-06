"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

var _email = require("../util/email");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/sell', _ensure_logined.default, (req, res) => {
  res.renderLogined('sell');
});
app.post('/sell', _ensure_logined.default, async (req, res) => {
  const deal = await _Deal.default.addNewDeal({ ...req.body,
    authorId: req.user._id
  });

  try {
    const template = await (0, _email.getHtmlTemplate)('verifyingStatus');
    await (0, _email.sendEmail)({
      to: req.user.email,
      subject: 'We are verifying your Ad',
      template: template({
        name: req.user.userName
      })
    });
    res.json({
      _id: deal._id
    });
  } catch (e) {
    console.log(e);
    res.json({
      _id: deal._id
    });
  }
});
app.post('/sell/edit/:dealId', _ensure_logined.default, async (req, res) => {
  const {
    dealId
  } = req.params;
  const deal = await _Deal.default.findById(dealId);

  if (deal.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.json({
      fail: 'Unauthorized Call'
    });
  }

  const result = await _Deal.default.updateDeal({ ...req.body,
    dealId
  });
  res.json({
    _id: result._id
  });
});
app.get('/sell/close/:postId', _ensure_logined.default, async (req, res) => {
  const {
    postId
  } = req.params;
  await _Deal.default.update({
    _id: postId
  }, {
    deleteAuto: new Date()
  });
  res.redirect('/manage');
});
app.get('/sell/delete/:postId', _ensure_logined.default, async (req, res) => {
  const {
    postId
  } = req.params;
  await _Deal.default.update({
    _id: postId
  }, {
    deletedAt: new Date()
  });
  res.redirect('/manage');
});
app.get('/sell/edit/:postId', _ensure_logined.default, async (req, res) => {
  const {
    postId
  } = req.params;
  const deal = await _Deal.default.findById(postId);

  if (deal.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.redirect('/');
  }

  res.renderLogined('edit', {
    deal: deal.getDealEditInfo()
  });
});
var _default = app;
exports.default = _default;