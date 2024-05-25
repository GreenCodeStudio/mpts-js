"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEMethodCall = void 0;
var _TEExpression = require("./TEExpression.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TEMethodCall extends _TEExpression.TEExpression {
  constructor(source) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    super();
    _defineProperty(this, "source", "");
    _defineProperty(this, "args", []);
    this.source = source;
    this.args = [];
  }
  execute(env) {
    return this.source.execute(env)(...this.args.map(x => x.execute(env)));
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = this.source.compileJS(scopedVariables).code;
    code += '(';
    code += this.args.map(x => x.compileJS(scopedVariables).code).join(',');
    code += ')';
    return {
      code
    };
  }
}
exports.TEMethodCall = TEMethodCall;