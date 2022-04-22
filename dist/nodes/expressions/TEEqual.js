"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEEqual = void 0;

class TEEqual {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  execute(env) {
    return this.left.execute(env) == this.right.execute(env);
  }

}

exports.TEEqual = TEEqual;