"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TLoop = void 0;
var _TNode = require("./TNode.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TLoop extends _TNode.TNode {
  constructor(count) {
    super();
    _defineProperty(this, "children", []);
    _defineProperty(this, "count", void 0);
    this.count = count;
  }
  execute(env) {
    var ret = env.document.createDocumentFragment();
    var count = this.count.execute(env);
    for (var i = 0; i < count; i++) {
      for (var child of this.children) {
        ret.appendChild(child.execute(env));
      }
    }
    return ret;
  }
}
exports.TLoop = TLoop;