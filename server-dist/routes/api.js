"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ensure_logined = _interopRequireDefault(require("../util/ensure_logined"));

var _s = require("../util/s3");

var _profile = _interopRequireDefault(require("./profile"));

var _mongoose = require("../config/mongoose");

var _Deal = _interopRequireDefault(require("../models/Deal"));

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
  console.log(req.body);
  const result = await _Deal.default.search(req.body);
  res.json({
    list: result
  });
});

_profile.default.post('/api/mail', async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    message
  } = req.body;
  var api_key = 'key-b14ad97b37f1eff6b7047353efdc9fc5';
  var domain = 'mail.hungrdeals.com';

  var mailgun = require('mailgun-js')({
    apiKey: api_key,
    domain: domain
  });

  const data = {
    from: `${firstName} ${lastName} <helpdesk@${domain}>`,
    to: 'Kartikoow@gmail.com',
    subject: 'User contact message has arrived!',
    html: `
        <h1>${email}</h1>
        <p>${message}</p>
        `
  };
  mailgun.messages().send(data, function (error, body) {});
  const data2 = {
    from: `${firstName} ${lastName} <helpdesk@${domain}>`,
    to: 'r54r45r54@gmail.com',
    subject: 'User contact message has arrived!',
    html: `
        <h1>${email}</h1>
        <p>${message}</p>
        `
  };
  mailgun.messages().send(data2, function (error, body) {});
  res.json({
    result: true
  });
});

var _default = _profile.default;
exports.default = _default;