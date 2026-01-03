"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEExpression = void 0;
var _MptsExecutionError = require("../../MptsExecutionError.js");
class TEExpression {
  safeJsName(name) {
    return name.replace(/\r\n\(\)\./g, '');
  }
  throw(message) {
    throw new _MptsExecutionError.MptsExecutionError(message, this.codePosition);
  }
}
exports.TEExpression = TEExpression;