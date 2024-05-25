"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEExpression = void 0;
class TEExpression {
  safeJsName(name) {
    return name.replace(/\r\n\(\)\./g, '');
  }
}
exports.TEExpression = TEExpression;