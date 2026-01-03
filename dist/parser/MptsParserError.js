"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MptsParserError = void 0;
class MptsParserError extends Error {
  constructor(message, codePosition, sample) {
    super("Parse error: ".concat(message, "\n\nCode:\n").concat(sample.replace(/\n/g, '\\n'), "\n\nFile: ").concat(codePosition));
    this.codePosition = codePosition;
    this.sample = sample;
  }
}
exports.MptsParserError = MptsParserError;