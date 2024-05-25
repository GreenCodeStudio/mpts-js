"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLParser = void 0;
var _AbstractMLParser = require("./AbstractMLParser.js");
var _TElement = require("../nodes/TElement.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class HTMLParser extends _AbstractMLParser.AbstractMLParser {
  constructor() {
    super(...arguments);
    _defineProperty(this, "voidElements", ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    _defineProperty(this, "onlySiblingsElements", ['li', 'dt', 'dd', 'p', 'rt', 'rp', 'optgroup', 'option', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th']);
    _defineProperty(this, "allowAutoClose", true);
  }
  static Parse(text) {
    return new HTMLParser(text).parseNormal();
  }
  addElement(element) {
    var autoclose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var parent = this.openElements[this.openElements.length - 1];
    if (parent instanceof _TElement.TElement && this.onlySiblingsElements.includes(element.tagName.toLowerCase()) && parent.tagName.toLowerCase() === element.tagName.toLowerCase()) {
      this.openElements.pop();
      parent = this.openElements[this.openElements.length - 1];
    }
    parent.children.push(element);
    if (!autoclose && !this.voidElements.includes(element.tagName.toLowerCase())) this.openElements.push(element);
  }
}
exports.HTMLParser = HTMLParser;