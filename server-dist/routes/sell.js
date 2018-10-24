"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

var _Deal = _interopRequireDefault(require("../models/Deal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _express.default.Router();

app.get('/sell', _ensure_logined.default, (req, res) => {
  res.renderLogined('sell');
});
app.post('/sell', _ensure_logined.default, async (req, res) => {
  const deal = await _Deal.default.addNewDeal({ ...req.body,
    authorId: req.user._id
  });
  res.json({
    _id: deal._id
  });
});
app.post('/sell/edit/:dealId', _ensure_logined.default, async (req, res) => {
  const {
    dealId
  } = req.params;
  const deal = await _Deal.default.updateDeal({ ...req.body,
    dealId
  });
  res.json({
    _id: deal._id
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
  console.log(deal.getDealEditInfo());
  res.renderLogined('edit', {
    deal: deal.getDealEditInfo()
  });
});
var _default = app;
exports.default = _default;