"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEProperty = void 0;
var _TEExpression = require("./TEExpression.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TEProperty extends _TEExpression.TEExpression {
  constructor(source) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var orNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    super();
    _defineProperty(this, "source", "");
    _defineProperty(this, "name", "");
    _defineProperty(this, "orNull", false);
    this.source = source;
    this.name = name;
    this.orNull = orNull;
  }
  execute(env) {
    var clonedEnv = env.scope();
    var parent = this.source.execute(clonedEnv);
    if (this.orNull || clonedEnv.allowUndefined) {
      env.allowUndefined = true;
    }
    if (env.allowUndefined) {
      var _parent, _parent$this$name;
      parent = (_parent = parent) !== null && _parent !== void 0 ? _parent : {};
      return (_parent$this$name = parent[this.name]) !== null && _parent$this$name !== void 0 ? _parent$this$name : null;
    } else {
      if (parent === null || parent === undefined || !(this.name in parent)) {
        this.throw("Undefined property: ".concat(this.name));
      }
      return parent[this.name];
    }
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = this.source.compileJS(scopedVariables).code + '[' + JSON.stringify(this.name) + ']';
    return {
      code
    };
  }
}
exports.TEProperty = TEProperty;