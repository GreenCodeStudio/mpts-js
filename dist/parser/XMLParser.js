"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLParser = void 0;

var _TDocumentFragment = require("../nodes/TDocumentFragment");

var _TText = require("../nodes/TText");

var _TElement = require("../nodes/TElement");

var _TEVariable = require("../nodes/expressions/TEVariable");

var _TExpressionText = require("../nodes/TExpressionText");

var _TAttribute = require("../nodes/TAttribute");

var _TIf = require("../nodes/TIf");

var _ExpressionParser = require("./ExpressionParser");

var _TEString = require("../nodes/expressions/TEString");

var _AbstractParser = require("./AbstractParser");

var _TLoop = require("../nodes/TLoop");

var _TComment = require("../nodes/TComment");

var _TForeach = require("../nodes/TForeach");

var _MptsParserError = require("./MptsParserError");

var _AbstractMLParser = require("./AbstractMLParser");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class XMLParser extends _AbstractMLParser.AbstractMLParser {
  constructor(text) {
    super();

    _defineProperty(this, "voidElements", []);

    _defineProperty(this, "allowAutoClose", false);

    this.text = text;
    this.position = 0;
    this.openElements = [new _TDocumentFragment.TDocumentFragment()];
  }

  static Parse(text) {
    return new XMLParser(text).parseNormal();
  }

}

exports.XMLParser = XMLParser;