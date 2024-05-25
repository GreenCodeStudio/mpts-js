"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TElement = void 0;
var _utils = require("../utils");
var _TNode = require("./TNode");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TElement extends _TNode.TNode {
  constructor() {
    super(...arguments);
    _defineProperty(this, "tagName", "");
    _defineProperty(this, "children", []);
    _defineProperty(this, "attributes", []);
  }
  execute(env) {
    var ret = env.document.createElement(this.tagName);
    for (var attr of this.attributes) {
      if (attr.expression) {
        var value = attr.expression.execute(env);
        if (typeof value === 'function') ret[attr.name] = value;else {
          if (value !== undefined && value !== null && value !== false) {
            ret.setAttribute(attr.name, value);
          }
        }
      } else ret.setAttribute(attr.name, attr.name);
    }
    for (var child of this.children) {
      ret.appendChild(child.execute(env));
    }
    return ret;
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createElement(' + JSON.stringify(this.tagName) + ');';
    for (var attr of this.attributes) {
      if (attr.expression) {
        var attrValueName = (0, _utils.getUniqName)();
        code += 'const ' + attrValueName + '=' + attr.expression.compileJS(scopedVariables).code + ';';
        code += "if(typeof ".concat(attrValueName, "==='function')").concat(rootName, "[").concat(JSON.stringify(attr.name), "]=").concat(attrValueName, ";else if(").concat(attrValueName, "!== undefined&&").concat(attrValueName, "!== null&&").concat(attrValueName, "!== false) ").concat(rootName, ".setAttribute(").concat(JSON.stringify(attr.name), ",").concat(attrValueName, ");");
      } else code += rootName + ".setAttribute(" + JSON.stringify(attr.name) + ", " + JSON.stringify(attr.name) + ");";
    }
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
    var attributes = this.attributes.map(attr => {
      if (attr.expression) {
        return JSON.stringify(attr.name) + ':' + attr.expression.compileJS(scopedVariables).code;
      } else {
        return JSON.stringify(attr.name) + ':' + JSON.stringify(attr.name);
      }
    });
    return 'h(' + JSON.stringify(this.tagName) + ',{' + attributes.join(',') + '},[' + this.children.map(c => c.compileJSVue(scopedVariables)) + '])';
  }
}
exports.TElement = TElement;