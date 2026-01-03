"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TENegate = void 0;
var _TEExpression = require("./TEExpression.js");
class TENegate extends _TEExpression.TEExpression {
  constructor(value) {
    super();
    this.value = value;
  }
  execute(env) {
    return !this.value.execute(env);
  }
  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = "(!(";
    code += this.value.compileJS(scopedVariables).code;
    code += '))';
    return {
      code
    };
  }
}
exports.TENegate = TENegate;