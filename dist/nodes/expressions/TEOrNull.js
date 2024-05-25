"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEOrNull = void 0;
var _TEExpression = require("./TEExpression.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TEOrNull extends _TEExpression.TEExpression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  execute(env) {
    var subEnv = _objectSpread(_objectSpread({}, env), {}, {
      allowUndefined: true
    });
    var left = this.left.execute(subEnv);
    if (left != null) {
      return left;
    } else {
      return this.right.execute(env);
    }
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = '(';
    code += this.left.compileJS(scopedVariables).code;
    code += '??';
    code += this.right.compileJS(scopedVariables).code;
    code += ')';
    return {
      code
    };
  }
}
exports.TEOrNull = TEOrNull;