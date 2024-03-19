"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractParser = void 0;

var _MptsParserError = require("./MptsParserError");

class AbstractParser {
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
    var lines = this.text.substr(0, this.position).split('\n');
    throw new _MptsParserError.MptsParserError(message, lines.length, lines[lines.length - 1].length, this.text.substr(this.position, 10));
  }

}

exports.AbstractParser = AbstractParser;
