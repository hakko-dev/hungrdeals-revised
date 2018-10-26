"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

var _ensure_admin = _interopRequireDefault(require("../util/ensure_admin"));

var _s = require("../util/s3");

var _profile = _interopRequireDefault(require("./profile"));

var _mongoose = require("../config/mongoose");

var _Deal = _interopRequireDefault(require("../models/Deal"));

var _email = require("../util/email");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_profile.default.post('/api/image', _ensure_logined.default, _s.upload.single('file'), async (req, res) => {
  const file = req.file;
  res.json({
    url: file.location
  });
});

_profile.default.get('/api/geo2postcode', async (req, res) => {
  const {
    lat,
    lng
  } = req.query;

  const myCursor = _mongoose.instance.db.collection('postcodes').aggregate([{
    "$geoNear": {
      "near": {
        "type": "Point",
        "coordinates": [parseFloat(lng), parseFloat(lat)]
      },
      "distanceField": "dist",
      "spherical": true
    }
  }, {
    "$sort": {
      "dist": 1,
      "_id": 1
    }
  }]).limit(1);

  const result = (await myCursor.hasNext()) ? await myCursor.next() : null;

  if (result) {
    res.json({
      postcode: result.postcode
    });
  } else {
    res.json({
      postcode: null
    });
  }
});

_profile.default.get('/api/postcode2geo', async (req, res) => {
  const {
    postcode
  } = req.query;

  var myCursor = _mongoose.instance.db.collection('postcodes').find({
    postcode: parseInt(postcode)
  }).limit(1);

  const result = (await myCursor.hasNext()) ? await myCursor.next() : null;

  if (result) {
    res.json({
      lat: result.lat,
      lng: result.lon
    });
  } else {
    res.json({
      lat: null,
      lng: null
    });
  }
});

_profile.default.post('/api/search', async (req, res) => {
  const result = await _Deal.default.search(req.body);
  res.json({
    list: result
  });
});

_profile.default.post('/api/admin/unverified', _ensure_logined.default, async (req, res) => {
  const result = await _Deal.default.find({
    verified: false
  });
  res.json({
    list: result
  });
});

_profile.default.post('/api/admin/verify', _ensure_admin.default, async (req, res) => {
  const {
    _id
  } = req.query;
  await _Deal.default.update({
    _id
  }, {
    verified: true
  });
  res.json({
    result: true
  });
});

_profile.default.delete('/api/deal', _ensure_admin.default, async (req, res) => {
  const {
    _id
  } = req.body;
  await _Deal.default.deleteOne({
    _id
  }).exec();
  res.json({
    result: true
  });
});

_profile.default.post('/api/mail', async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    message
  } = req.body;

  try {
    await (0, _email.sendEmail)({
      to: 'hungrdeals@outlook.com',
      subject: 'Customer Inquiry',
      template: `${email} ${firstName} ${lastName} ${message}`
    });
    await (0, _email.sendEmail)({
      to: 'lee.kim.dev.au@gmail.com',
      subject: 'Customer Inquiry',
      template: `${email} ${firstName} ${lastName} ${message}`
    });
    res.json({
      result: true
    });
  } catch (e) {
    console.log(e);
    res.json({
      result: false
    });
  }
});

_profile.default.post('/api/mail/about', async (req, res) => {
  const {
    email,
    name,
    phone,
    message
  } = req.body;

  try {
    await (0, _email.sendEmail)({
      to: 'hungrdeals@outlook.com',
      subject: 'Customer Inquiry',
      template: `${email} ${name} ${phone} ${message}`
    });
    await (0, _email.sendEmail)({
      to: 'lee.kim.dev.au@gmail.com',
      subject: 'Customer Inquiry',
      template: `${email} ${name} ${phone} ${message}`
    });
    res.json({
      result: true
    });
  } catch (e) {
    console.log(e);
    res.json({
      result: false
    });
  }
});

_profile.default.get('/verification', async (req, res) => {
  if (req.isAuthenticated()) {
    res.renderLogined('verification');
  } else {
    res.render('verification');
  }
});

_profile.default.get('/verification/done', async (req, res) => {
  if (req.isAuthenticated()) {
    res.renderLogined('verification-done');
  } else {
    res.render('verification-done');
  }
});

var _default = _profile.default;
exports.default = _default;