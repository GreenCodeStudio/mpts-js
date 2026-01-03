"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodePosition = void 0;
class CodePosition {
  constructor(fileName, lineNumber, columnNumber, fileOffset) {
    this.fileName = fileName !== null && fileName !== void 0 ? fileName : null;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
    this.fileOffset = fileOffset;
  }
  toString() {
    var _this$fileName;
    return "".concat((_this$fileName = this.fileName) !== null && _this$fileName !== void 0 ? _this$fileName : '<unknown>', ":").concat(this.lineNumber, ":").concat(this.columnNumber);
  }
}
exports.CodePosition = CodePosition;