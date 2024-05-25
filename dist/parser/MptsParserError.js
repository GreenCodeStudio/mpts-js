"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MptsParserError = void 0;
class MptsParserError extends Error {
  constructor(message, line, column, sample) {
    super(message + '\r\n' + sample.replace(/\n/g, '\\n') + '\r\n' + line + ":" + column);
    this.messageRaw = message;
    this.line = line;
    this.column = column;
    this.sample = sample;
  }
}
exports.MptsParserError = MptsParserError;