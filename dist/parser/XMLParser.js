"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLParser = void 0;
var _TDocumentFragment = require("../nodes/TDocumentFragment.js");
var _TText = require("../nodes/TText.js");
var _TElement = require("../nodes/TElement.js");
var _TEVariable = require("../nodes/expressions/TEVariable.js");
var _TExpressionText = require("../nodes/TExpressionText.js");
var _TAttribute = require("../nodes/TAttribute.js");
var _TIf = require("../nodes/TIf.js");
var _ExpressionParser = require("./ExpressionParser.js");
var _TEString = require("../nodes/expressions/TEString.js");
var _AbstractParser = require("./AbstractParser.js");
var _TLoop = require("../nodes/TLoop.js");
var _TComment = require("../nodes/TComment.js");
var _TForeach = require("../nodes/TForeach.js");
var _MptsParserError = require("./MptsParserError.js");
var _AbstractMLParser = require("./AbstractMLParser.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  addElement(element) {
    var selfclose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var parent = this.openElements[this.openElements.length - 1];
    parent.children.push(element);
    if (!selfclose) this.openElements.push(element);
  }
}
exports.XMLParser = XMLParser;