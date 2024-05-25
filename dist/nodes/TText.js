"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TText = void 0;
var _utils = require("../utils.js");
var _he = _interopRequireDefault(require("he"));
var _TNode = require("./TNode.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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