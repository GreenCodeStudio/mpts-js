"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLParser = void 0;

var _XMLParser = require("./XMLParser");

var _AbstractMLParser = require("./AbstractMLParser");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HTMLParser extends _AbstractMLParser.AbstractMLParser {
  constructor() {
    super(...arguments);

    _defineProperty(this, "voidElements", ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    _defineProperty(this, "allowAutoClose", true);
  }

  static Parse(text) {
    return new HTMLParser(text).parseNormal();
  }

}

exports.HTMLParser = HTMLParser;