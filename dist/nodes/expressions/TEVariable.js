"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEVariable = void 0;
var _utils = require("../../utils");
var _TEExpression = require("./TEExpression");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TEVariable extends _TEExpression.TEExpression {
  constructor() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    super();
    _defineProperty(this, "name", "");
    this.name = name;
  }
  execute(env) {
    return env.variables[this.name];
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code;
    if (scopedVariables.has(this.name)) {
      code = this.safeJsName(this.name);
    } else {
      code = 'variables[' + JSON.stringify(this.name) + ']';
    }
    return {
      code
    };
  }
}
exports.TEVariable = TEVariable;