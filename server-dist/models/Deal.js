"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("../config/mongoose"));

var _mongooseCreatedatUpdatedat = _interopRequireDefault(require("mongoose-createdat-updatedat"));

var _pointSchema = _interopRequireDefault(require("./pointSchema"));

var _libphonenumberJs = require("libphonenumber-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const dealSchema = new Schema({
  author: ObjectId,
  category: String,
  cuisineType: String,
  title: String,
  description: String,
  items: [{
    itemName: String,
    prevPrice: Number,
    nowPrice: Number
  }],
  images: [String],
  phone: String,
  address: String,
  location: {
    type: _pointSchema.default
  },
  opening: [{
    day: String,
    open: Number,
    close: Number
  }],
  deleteAuto: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  // 업데이트시 변하는 것들
  cheapestItem: {
    itemName: String,
    prevPrice: Number,
    nowPrice: Number
  },
  maxDiscount: Number,
  itemsCount: Number,
  deletedAt: Date,
  happyHour: {
    start: Number,
    end: Number
  }
});
dealSchema.plugin(_mongooseCreatedatUpdatedat.default);

function convertDayEnumToString(enumString) {
  switch (enumString) {
    case 'MON':
      return 'MONDAY';

    case 'TUE':
      return 'TUESDAY';

    case 'WED':
      return 'WEDNESDAY';

    case 'THU':
      return 'THURSDAY';

    case 'FRI':
      return 'FRIDAY';

    case 'SAT':
      return 'SATURDAY';

    case 'SUN':
      return 'SUNDAY';
  }
}

dealSchema.methods.getListInfo = function () {
  return {
    _id: this._id,
    cuisineType: this.cuisineType,
    title: this.title,
    description: this.description,
    itemSize: this.items && this.items.length,
    cheapestItem: this.cheapestItem,
    address: this.address
  };
};

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

dealSchema.methods.getDealInfo = function () {
  const openingHours = this.opening.map(row => {
    const newRow = {};
    newRow.day = {
      string: convertDayEnumToString(row.day),
      enum: row.day
    };
    newRow.open = `${row.open.toString().slice(0, -2)}:${row.open.toString().slice(-2)}`;
    newRow.close = `${row.close.toString().slice(0, -2)}:${row.close.toString().slice(-2)}`;
    return newRow;
  });
  const happyHour = this.happyHour.start ? {
    start: `${this.happyHour.start.toString().slice(0, -2)}:${this.happyHour.start.toString().slice(-2)}`,
    end: `${this.happyHour.end.toString().slice(0, -2)}:${this.happyHour.end.toString().slice(-2)}`
  } : null;
  return {
    category: this.category,
    cuisineType: this.cuisineType,
    title: this.title,
    description: this.description.split('\n').map(line => `<p>${line}</p>`).join(''),
    items: this.items,
    images: this.images,
    phone: new _libphonenumberJs.AsYouType('AU').input(this.phone) || 'Invalid Number',
    address: this.address,
    lat: this.location.coordinates[1],
    lng: this.location.coordinates[0],
    deleteAuto: this.deleteAuto,
    opening: week.map(day => {
      const filtered = openingHours.filter(i => i.day.enum === day);

      if (filtered.length !== 0) {
        return filtered[0];
      } else {
        return {
          day: {
            string: convertDayEnumToString(day),
            enum: day
          },
          open: null,
          close: null
        };
      }
    }),
    _id: this._id,
    author: this.author,
    happyHour,
    verified: this.verified,
    createdAt: this.createdAt
  };
};

dealSchema.methods.getDealEditInfo = function () {
  const openingHours = this.opening.map(row => {
    const newRow = {};
    newRow.day = {
      string: convertDayEnumToString(row.day),
      enum: row.day
    };
    newRow.open = `${row.open.toString().slice(0, -2)}:${row.open.toString().slice(-2)}`;
    newRow.close = `${row.close.toString().slice(0, -2)}:${row.close.toString().slice(-2)}`;
    return newRow;
  });
  const happyHour = this.happyHour.start ? {
    start: `${this.happyHour.start.toString().slice(0, -2)}:${this.happyHour.start.toString().slice(-2)}`,
    end: `${this.happyHour.end.toString().slice(0, -2)}:${this.happyHour.end.toString().slice(-2)}`
  } : null;
  const weekRaw = week.map(day => {
    const filtered = openingHours.filter(i => i.day.enum === day);

    if (filtered.length !== 0) {
      return { ...filtered[0],
        ...{
          day: filtered[0].day.enum
        }
      };
    } else {
      return {
        day,
        open: null,
        close: null
      };
    }
  });
  const sunday = weekRaw.shift();
  weekRaw.push(sunday);
  return {
    _id: this._id,
    happyHour,
    category: this.category,
    cuisineType: this.cuisineType,
    title: this.title,
    description: this.description,
    items: this.items,
    images: this.images,
    phone: this.phone,
    address: this.address,
    lat: this.location.coordinates[1],
    lng: this.location.coordinates[0],
    deleteAuto: this.deleteAuto,
    opening: weekRaw,
    createdAt: this.createdAt
  };
};

dealSchema.statics.addNewDeal = async function ({
  happyHour,
  authorId,
  category,
  cuisineType,
  title,
  description,
  items,
  images,
  phone,
  address,
  lat,
  lng,
  deleteAuto,
  opening
}) {
  // const phoneNumber = parsePhoneNumber(phone)
  // console.log(phoneNumber)
  // return;
  const result = await this.create({
    author: authorId,
    category,
    cuisineType,
    title,
    description,
    items,
    images,
    phone,
    address,
    deleteAuto,
    opening: opening.map(item => {
      item.open = parseInt(item.open.split(':').join(''));
      item.close = parseInt(item.close.split(':').join(''));
      return item;
    }),
    location: {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    },
    cheapestItem: items && items.length !== 0 ? items.sort((a, b) => {
      return a.nowPrice - b.nowPrice;
    })[0] : null,
    maxDiscount: items && items.length !== 0 ? items.map(item => {
      const discount = 1.0 * (item.prevPrice - item.nowPrice) / item.prevPrice * 100; // discount

      if (item.prevPrice === 0 || discount < 0) {
        return 0;
      }

      return discount;
    }).sort((a, b) => b - a)[0] : null,
    happyHour: happyHour ? {
      start: parseInt(happyHour.start.split(':').join('')),
      end: parseInt(happyHour.end.split(':').join(''))
    } : null,
    itemsCount: items ? items.length : null
  });
  return result;
};

dealSchema.statics.updateDeal = async function ({
  happyHour,
  dealId,
  category,
  cuisineType,
  title,
  description,
  items,
  images,
  phone,
  address,
  lat,
  lng,
  deleteAuto,
  opening
}) {
  const result = await this.update({
    _id: dealId
  }, {
    category,
    cuisineType,
    title,
    description,
    items,
    images,
    phone,
    address,
    deleteAuto,
    opening: opening.map(item => {
      item.open = parseInt(item.open.split(':').join(''));
      item.close = parseInt(item.close.split(':').join(''));
      return item;
    }),
    location: {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    },
    cheapestItem: items && items.length !== 0 ? items.sort((a, b) => {
      return a.nowPrice - b.nowPrice;
    })[0] : null,
    maxDiscount: items && items.length !== 0 ? items.map(item => {
      const discount = 1.0 * (item.prevPrice - item.nowPrice) / item.prevPrice * 100; // discount

      if (item.prevPrice === 0 || discount < 0) {
        return 0;
      }

      return discount;
    }).sort((a, b) => b - a)[0] : null,
    happyHour: happyHour ? {
      start: parseInt(happyHour.start.split(':').join('')),
      end: parseInt(happyHour.end.split(':').join(''))
    } : null,
    itemsCount: items ? items.length : null
  });
  return {
    _id: dealId
  };
};

dealSchema.statics.search = async function ({
  search = '',
  sort = 'RECENT',
  filter = 'ALL',
  category = null,
  openHourStart = 0,
  openHourEnd = 2400,
  currentLocationLat = null,
  currentLocationLng = null,
  distance = 5,
  priceRangeStart = 0,
  priceRangeEnd = 100,
  cuisineType = ['ALL']
}) {
  // for open hour
  const todayDay = week[new Date().getDay()];
  const aggData = [];

  if (currentLocationLat && currentLocationLng) {
    aggData.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(currentLocationLng), parseFloat(currentLocationLat)]
        },
        distanceField: "dist",
        $maxDistance: parseFloat(distance) * 1000,
        spherical: true
      }
    });
  }

  aggData.push({
    $match: {
      $and: [{
        deletedAt: {
          $exists: false
        }
      }, {
        verified: {
          $eq: true
        }
      }, {
        $or: [{
          'title': {
            '$regex': search,
            '$options': 'i'
          }
        }, {
          'description': {
            '$regex': search,
            '$options': 'i'
          }
        }]
      }]
    }
  });

  if (category) {
    aggData.push({
      $match: {
        'category': {
          '$regex': category,
          '$options': 'i'
        }
      }
    });
  }

  if (cuisineType[0] !== 'All') {
    aggData.push({
      $match: {
        'cuisineType': {
          $in: cuisineType
        }
      }
    });
  }

  if (!category || category.indexOf('Menus') === -1) {
    aggData.push({
      $match: {
        'cheapestItem.nowPrice': {
          $gt: parseInt(priceRangeStart) - 1,
          $lt: parseInt(priceRangeEnd) + 1
        }
      }
    });
  }

  aggData.push({
    $addFields: {
      opening: {
        $filter: {
          input: "$opening",
          as: "item",
          cond: {
            $eq: ["$$item.day", todayDay]
          }
        }
      }
    }
  });

  if (filter === 'OPEN') {
    aggData.push({
      $match: {
        'opening.0': {
          $exists: true
        },
        'opening.0.open': {
          $lt: openHourStart + 1
        },
        'opening.0.close': {
          $gt: openHourEnd - 1
        }
      }
    });
  }

  switch (sort) {
    case 'Recent':
      aggData.push({
        $sort: {
          createdAt: -1
        }
      });
      break;

    case 'Lowest':
      aggData.push({
        $sort: {
          'cheapestItem.nowPrice': 1
        }
      });
      break;

    case 'Highest':
      aggData.push({
        $sort: {
          'cheapestItem.nowPrice': -1
        }
      });
      break;

    case 'High Discount':
      aggData.push({
        $sort: {
          'maxDiscount': -1
        }
      });
      break;

    case 'Nearest':
      aggData.push({
        $sort: {
          'dist': 1
        }
      });
      break;

    case 'Many Items':
      aggData.push({
        $sort: {
          score: {
            $meta: "textScore"
          },
          'itemsCount': -1
        }
      });
      break;
  }

  const result = await this.aggregate(aggData).exec();
  return result.map(item => {
    return {
      _id: item._id,
      cuisineType: item.cuisineType,
      title: item.title,
      description: item.description,
      itemSize: item.items && item.items.length,
      cheapestItem: item.cheapestItem,
      address: item.address,
      dist: item.dist,
      opening: item.opening
    };
  });
};

const Deal = _mongoose.default.model('Deal', dealSchema);

var _default = Deal;
exports.default = _default;

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;

    padString = String(typeof padString !== 'undefined' ? padString : ' ');

    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;

      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }

      return padString.slice(0, targetLength) + String(this);
    }
  };
}