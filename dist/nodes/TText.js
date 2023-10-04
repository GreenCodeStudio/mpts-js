"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TText = void 0;

var _utils = require("../utils");

var _he = _interopRequireDefault(require("he"));

var _TNode = require("./TNode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TText extends _TNode.TNode {
  constructor() {
    super(...arguments);

    _defineProperty(this, "text", "");
  }

  execute(env) {
    return env.document.createTextNode(_he.default.decode(this.text));
  }

  compileJS() {
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createTextNode(' + JSON.stringify(_he.default.decode(this.text)) + ');';
    return {
      code,
      rootName
    };
  }

  compileJSVue() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    return JSON.stringify(this.text);
  }

}

exports.TText = TText;