"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractParser = void 0;

class AbstractParser {
  readUntill(regexp) {
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
    this.readUntill(/\S/);
  }

  readUntillText(text) {
    var ret = '';

    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (this.text.substr(this.position, this.position + text.length) == text) break;
      ret += char;
      this.position++;
    }

    return ret;
  }

}

exports.AbstractParser = AbstractParser;