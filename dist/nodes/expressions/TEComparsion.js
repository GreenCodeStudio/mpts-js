"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEComparsion = void 0;
var _TEExpression = require("./TEExpression.js");
class TEComparsion extends _TEExpression.TEExpression {
  constructor(left, right, isGreaterThan, orEqual) {
    super();
    this.left = left;
    this.right = right;
    this.isGreaterThan = isGreaterThan;
    this.orEqual = orEqual;
  }
  execute(env) {
    var l = this.left.execute(env);
    var r = this.right.execute(env);
    if (this.isGreaterThan) {
      if (this.orEqual) {
        return l >= r;
      } else {
        return l > r;
      }
    } else {
      if (this.orEqual) {
        return l <= r;
      } else {
        return l < r;
      }
    }
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var l = this.left.compileJS(scopedVariables);
    var r = this.right.compileJS(scopedVariables);
    var code = "(";
    code += l.code;
    if (this.isGreaterThan) {
      code += this.orEqual ? '>=' : '>';
    } else {
      code += this.orEqual ? '<=' : '<';
    }
    code += r.code;
    code += ')';
    return {
      code
    };
  }
}
exports.TEComparsion = TEComparsion;