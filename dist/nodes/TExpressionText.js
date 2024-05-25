"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TExpressionText = void 0;
var _utils = require("../utils");
var _he = _interopRequireDefault(require("he"));
var _TText = require("./TText");
var _TNode = require("./TNode");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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