"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TESubtract = void 0;
var _TEExpression = require("./TEExpression");
class TESubtract extends _TEExpression.TEExpression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  execute(env) {
    return this.left.execute(env) - this.right.execute(env);
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = "(";
    code += this.left.compileJS(scopedVariables).code;
    code += '-';
    code += this.right.compileJS(scopedVariables).code;
    code += ')';
    return {
      code
    };
  }
}
exports.TESubtract = TESubtract;