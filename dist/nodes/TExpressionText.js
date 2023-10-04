"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TExpressionText = void 0;

var _utils = require("../utils");

var _he = _interopRequireDefault(require("he"));

var _TText = require("./TText");

var _TNode = require("./TNode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TExpressionText extends _TNode.TNode {
  constructor() {
    super(...arguments);

    _defineProperty(this, "expression", null);
  }

  execute(env) {
    return env.document.createTextNode(this.expression.execute(env));
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createTextNode(' + this.expression.compileJS(scopedVariables).code + ');';
    return {
      code,
      rootName
    };
  }

  compileJSVue() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    return this.expression.compileJS(scopedVariables).code;
  }

}

exports.TExpressionText = TExpressionText;