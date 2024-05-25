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