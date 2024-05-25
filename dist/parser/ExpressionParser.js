"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionParser = void 0;
var _TDocumentFragment = require("../nodes/TDocumentFragment.js");
var _TEVariable = require("../nodes/expressions/TEVariable.js");
var _TEBoolean = require("../nodes/expressions/TEBoolean.js");
var _TENumber = require("../nodes/expressions/TENumber.js");
var _TEString = require("../nodes/expressions/TEString.js");
var _TEEqual = require("../nodes/expressions/TEEqual.js");
var _AbstractParser = require("./AbstractParser.js");
var _TEProperty = require("../nodes/expressions/TEProperty.js");
var _TEMethodCall = require("../nodes/expressions/TEMethodCall.js");
var _TEConcatenate = require("../nodes/expressions/TEConcatenate.js");
var _TEAdd = require("../nodes/expressions/TEAdd.js");
var _TESubtract = require("../nodes/expressions/TESubtract.js");
var _TEOrNull = require("../nodes/expressions/TEOrNull.js");
class ExpressionParser extends _AbstractParser.AbstractParser {
  constructor(text) {
    super();
    this.text = text;
    this.position = 0;
  }
  static Parse(text) {
    var endLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return new ExpressionParser(text).parseNormal(endLevel);
  }
  parseNormal() {
    var endLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var lastNode = null;
    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (/\s/.test(char)) {
        this.position++;
      } else if (lastNode && char == '.') {
        this.position++;
        var name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
        lastNode = new _TEProperty.TEProperty(lastNode, name);
      } else if (/[0-9\.]/.test(char)) {
        this.position++;
        var value = char + this.readUntil(/[^0-9\.e]/);
        lastNode = new _TENumber.TENumber(+value);
      } else if (char == '"') {
        this.position++;
        var _value = this.readUntil(/"/);
        this.position++;
        lastNode = new _TEString.TEString(_value);
      } else if (char == "'") {
        this.position++;
        var _value2 = this.readUntil(/'/);
        this.position++;
        lastNode = new _TEString.TEString(_value2);
      } else if (char == "(") {
        if (lastNode) {
          lastNode = new _TEMethodCall.TEMethodCall(lastNode);
          this.position++;
          this.skipWhitespace();
          while (this.text[this.position] != ')') {
            if (this.position >= this.text.length) this.throw('Unexpected end of input');
            var _value3 = this.parseNormal(2);
            lastNode.args.push(_value3);
            if (this.text[this.position] == ',') this.position++;
          }
          this.position++;
        } else {
          this.position++;
          var _value4 = this.parseNormal(1);
          this.position++;
          lastNode = _value4;
        }
      } else if (char == ")") {
        if (endLevel >= 1) {
          break;
        } else {
          this.throw("( not opened");
        }
      } else if (char == "=" && this.text[this.position + 1] == "=") {
        this.position += 2;
        var right = this.parseNormal(2);
        lastNode = new _TEEqual.TEEqual(lastNode, right);
      } else if (char == "?" && this.text[this.position + 1] == "?") {
        if (endLevel >= 5) {
          break;
        }
        this.position += 2;
        var _right = this.parseNormal(5);
        lastNode = new _TEOrNull.TEOrNull(lastNode, _right);
      } else if (char == ",") {
        if (endLevel >= 2) {
          break;
        } else {
          this.throw("Unexpected character");
        }
      } else if (char == "+") {
        if (endLevel >= 4) {
          break;
        }
        this.position++;
        var _right2 = this.parseNormal(4);
        lastNode = new _TEAdd.TEAdd(lastNode, _right2);
      } else if (char == "-") {
        if (endLevel >= 4) {
          break;
        }
        this.position++;
        var _right3 = this.parseNormal(4);
        lastNode = new _TESubtract.TESubtract(lastNode, _right3);
      } else if (char == ":") {
        this.position++;
        var _right4 = this.parseNormal(3);
        lastNode = new _TEConcatenate.TEConcatenate(lastNode, _right4);
      } else if (char == ">" || char == "\\") {
        if (lastNode) {
          break;
        } else {
          this.throw("Unexpected character");
        }
      } else {
        if (lastNode) {
          break;
        }
        var _name = this.readUntil(/['"\(\)=\.\s:>/+\-*?,]/);
        if (_name == 'true') lastNode = new _TEBoolean.TEBoolean(true);else if (_name == 'false') lastNode = new _TEBoolean.TEBoolean(false);else lastNode = new _TEVariable.TEVariable(_name);
      }
    }
    return lastNode;
  }
}
exports.ExpressionParser = ExpressionParser;