"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TDocumentFragment = void 0;
var _utils = require("../utils");
var _TNode = require("./TNode");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TDocumentFragment extends _TNode.TNode {
  constructor() {
    super(...arguments);
    _defineProperty(this, "children", []);
  }
  execute(env) {
    var ret = env.document.createDocumentFragment();
    for (var child of this.children) {
      ret.appendChild(child.execute(env));
    }
    return ret;
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createDocumentFragment();';
    for (var child of this.children) {
      var childResult = child.compileJS(scopedVariables);
      code += childResult.code;
      code += rootName + ".append(" + childResult.rootName + ");";
    }
    return {
      code,
      rootName
    };
  }
  compileJSVue() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    return "[".concat(this.children.map(x => x.compileJSVue(scopedVariables)).join(','), "]");
  }
}
exports.TDocumentFragment = TDocumentFragment;