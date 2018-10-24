"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = exports.getTemplate = void 0;

var _mjml = _interopRequireDefault(require("mjml"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _mailgunJs = _interopRequireDefault(require("mailgun-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const compile = require("string-template/compile");

const readFile = _util.default.promisify(_fs.default.readFile);

const getTemplate = async templateName => {
  try {
    const mjml = await readFile(_path.default.join(__dirname, `../email-templates/${templateName}.mjml`));
    const htmlOutput = (0, _mjml.default)(mjml.toString());
    const template = compile(htmlOutput.html);
    return template;
  } catch (e) {
    console.log(e);
    return new Error(`NO TEMPLATE WITH NAME: ${templateName}`);
  }
};

exports.getTemplate = getTemplate;
const api_key = process.env.MAILGUN_KEY;
const mailDomain = process.env.MAILGUN_URL;
const mailgun = (0, _mailgunJs.default)({
  apiKey: api_key,
  domain: mailDomain
});

const sendEmail = async ({
  to,
  template,
  subject
}) => {
  const mailData = {
    from: `<no-reply@${mailDomain}>`,
    to,
    subject,
    html: template
  };
  return new Promise((resolve, reject) => {
    mailgun.messages().send(mailData, function (error, body) {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
};

exports.sendEmail = sendEmail;