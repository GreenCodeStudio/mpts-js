"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIf = void 0;

var _utils = require("../utils");

var _TNode = require("./TNode");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  compileJS() {
    var rootName = (0, _utils.getUniqName)();
    var code = 'let ' + rootName + '=document.createDocumentFragment();';

    for (var condition of this.conditions) {
      code += (condition == this.conditions[0] ? 'if' : 'else if') + '(' + condition.expression.compileJS().code + '){';

      for (var child of condition.children) {
        var childResult = child.compileJS();
        code += childResult.code;
        code += rootName + ".append(" + childResult.rootName + ");";
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

}

exports.TIf = TIf;