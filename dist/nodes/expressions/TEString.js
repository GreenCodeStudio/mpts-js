"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEString = void 0;
var _TEExpression = require("./TEExpression.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TEString extends _TEExpression.TEExpression {
  constructor() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    super();
    _defineProperty(this, "value", "");
    this.value = "" + value;
  }
  execute(env) {
    return "" + this.value;
  }
  compileJS() {
    var code = JSON.stringify("" + this.value);
    return {
      code
    };
  }
}
exports.TEString = TEString;