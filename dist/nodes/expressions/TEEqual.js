"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEEqual = void 0;

var _TEExpression = require("./TEExpression");

class TEEqual extends _TEExpression.TEExpression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  execute(env) {
    return this.left.execute(env) == this.right.execute(env);
  }

}

exports.TEEqual = TEEqual;