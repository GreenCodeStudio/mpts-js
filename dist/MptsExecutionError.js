"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MptsExecutionError = void 0;
class MptsExecutionError extends Error {
  constructor(message, codePosition, previous) {
    super("".concat(message, "\r\n").concat(codePosition));
    this.codePosition = codePosition;
    this.messageRaw = message;
    this.previous = previous;
  }
}
exports.MptsExecutionError = MptsExecutionError;