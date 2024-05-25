"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIf = void 0;
var _utils = require("../utils");
var _TNode = require("./TNode");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TIf extends _TNode.TNode {
  constructor() {
    super(...arguments);
    _defineProperty(this, "conditions", []);
    _defineProperty(this, "else", null);
  }
  execute(env) {
    for (var condition of this.conditions) {
      if (condition.expression.execute(env)) {
        return this.executeCondition(condition, env);
      }
    }
    if (this.else) {
      return this.executeCondition(this.else, env);
    }
    return null;
  }
  executeCondition(condition, env) {
    if (condition.children.length == 1) return condition.children[0].execute(env);
    var ret = env.document.createDocumentFragment();
    for (var child of condition.children) {
      ret.appendChild(child.execute(env));
    }
    return ret;
  }
  compileJS(scopedVariables) {
    var rootName = (0, _utils.getUniqName)();
    var code = 'let ' + rootName + '=document.createDocumentFragment();';
    for (var condition of this.conditions) {
      code += (condition == this.conditions[0] ? 'if' : 'else if') + '(' + condition.expression.compileJS(scopedVariables).code + '){';
      for (var child of condition.children) {
        var childResult = child.compileJS(scopedVariables);
        code += childResult.code;
        code += rootName + ".append(" + childResult.rootName + ");";
      }
      code += '}';
    }
    if (this.else) {
      code += 'else{';
      for (var _child of this.else.children) {
        var _childResult = _child.compileJS(scopedVariables);
        code += _childResult.code;
        code += rootName + ".append(" + _childResult.rootName + ");";
      }
      code += '}';
    }
    return {
      code,
      rootName
    };
  }
  get children() {
    if (this.else) return this.else.children;else return this.conditions[this.conditions.length - 1].children;
  }
  compileJSVue() {
    var _this$else;
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = (_this$else = this.else) === null || _this$else === void 0 ? void 0 : _this$else.compileJSVue(scopedVariables).code;
    for (var condition of [...this.conditions].reverse()) {
      code = "(".concat(condition.expression.compileJS(scopedVariables).code, " ? ([").concat(condition.children.map(c => c.compileJSVue(scopedVariables)).join(','), "]) : ").concat(code, ")");
    }
    return code;
  }
}
exports.TIf = TIf;