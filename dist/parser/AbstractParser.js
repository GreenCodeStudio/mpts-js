"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractParser = void 0;
var _MptsParserError = require("./MptsParserError.js");
var _CodePosition = require("../CodePosition.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class AbstractParser {
  constructor() {
    _defineProperty(this, "text", '');
    _defineProperty(this, "fileName", null);
    _defineProperty(this, "fileLineOffset", null);
    _defineProperty(this, "fileColumnOffset", null);
    _defineProperty(this, "filePositionOffset", null);
    _defineProperty(this, "position", 0);
    _defineProperty(this, "openElements", []);
  }
  readUntil(regexp) {
    var ret = '';
    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (regexp.test(char)) break;
      ret += char;
      this.position++;
    }
    return ret;
  }
  skipWhitespace() {
    this.readUntil(/\S/);
  }
  readUntilText(text) {
    var ret = '';
    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (this.text.substr(this.position, text.length) == text) break;
      ret += char;
      this.position++;
    }
    return ret;
  }
  throw(message) {
    throw new _MptsParserError.MptsParserError(message, this.currentCodePosition, this.text.substr(this.position, 10));
  }
  get currentLineOffset() {
    var _this$fileLineOffset;
    var substr = this.text.substr(0, this.position);
    var count = (substr.match(/\n/g) || []).length;
    return count + ((_this$fileLineOffset = this.fileLineOffset) !== null && _this$fileLineOffset !== void 0 ? _this$fileLineOffset : 1);
  }
  get currentColumnOffset() {
    var _this$fileColumnOffse;
    var substr = this.text.substr(0, this.position);
    var lines = substr.split('\n');
    var lineNumber = lines.length - 1;
    var startLine = lines[lineNumber].length;
    return startLine + (lineNumber === 0 ? (_this$fileColumnOffse = this.fileColumnOffset) !== null && _this$fileColumnOffse !== void 0 ? _this$fileColumnOffse : 0 : 0);
  }
  get currentFilePosition() {
    var _this$filePositionOff;
    return this.position + ((_this$filePositionOff = this.filePositionOffset) !== null && _this$filePositionOff !== void 0 ? _this$filePositionOff : 0);
  }
  get currentCodePosition() {
    return new _CodePosition.CodePosition(this.fileName, this.currentLineOffset, this.currentColumnOffset, this.currentFilePosition);
  }
}
exports.AbstractParser = AbstractParser;