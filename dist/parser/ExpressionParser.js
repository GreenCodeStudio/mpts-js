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
var _TEMultiply = require("../nodes/expressions/TEMultiply.js");
var _TEDivide = require("../nodes/expressions/TEDivide.js");
var _TEModulo = require("../nodes/expressions/TEModulo.js");
var _TEComparsion = require("../nodes/expressions/TEComparsion.js");
var _htmlEntities = require("html-entities");
var _TEAnd = require("../nodes/expressions/TEAnd.js");
var _TENegate = require("../nodes/expressions/TENegate.js");
var _TEOr = require("../nodes/expressions/TEOr.js");
class ExpressionParser extends _AbstractParser.AbstractParser {
  constructor(text) {
    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var filePositionOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var fileLineOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var fileColumnOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    super();
    this.text = text;
    this.position = 0;
    this.filePositionOffset = filePositionOffset;
    this.fileLineOffset = fileLineOffset;
    this.fileColumnOffset = fileColumnOffset;
    this.fileName = fileName;
  }
  static Parse(text) {
    var codePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return new ExpressionParser(text, codePosition === null || codePosition === void 0 ? void 0 : codePosition.fileName, codePosition === null || codePosition === void 0 ? void 0 : codePosition.fileOffset, codePosition === null || codePosition === void 0 ? void 0 : codePosition.lineNumber, codePosition === null || codePosition === void 0 ? void 0 : codePosition.columnNumber).parseNormal();
  }
  parseNormal() {
    var endLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var lastNode = null;
    while (this.position < this.text.length) {
      var char = this.text[this.position];
      var partCodePosition = this.currentCodePosition;
      if (/\s/.test(char)) {
        this.position++;
      } else if (lastNode && char == '?' && this.text[this.position + 1] == '.') {
        this.position += 2;
        var _partCodePosition = this.currentCodePosition;
        var name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
        lastNode = new _TEProperty.TEProperty(lastNode, name, true);
        lastNode.codePosition = _partCodePosition;
      } else if (lastNode && char == '.') {
        this.position++;
        var _partCodePosition2 = this.currentCodePosition;
        var _name = this.readUntil(/['"\(\)=\.:\s>+\-*?]/);
        lastNode = new _TEProperty.TEProperty(lastNode, _name, false);
        lastNode.codePosition = _partCodePosition2;
      } else if (/[0-9\.]/.test(char)) {
        this.position++;
        var value = char + this.readUntil(/[^0-9\.e]/);
        if (/^(\.e*|e+)/.test(char)) {
          this.position--;
          this.throw("Unexpected '" + char + "'");
        }
        lastNode = new _TENumber.TENumber(+value);
      } else if (char == '"') {
        this.position++;
        var _value = this.readUntil(/"/);
        this.position++;
        lastNode = new _TEString.TEString((0, _htmlEntities.decode)(_value));
      } else if (char == "'") {
        this.position++;
        var _value2 = this.readUntil(/'/);
        this.position++;
        lastNode = new _TEString.TEString((0, _htmlEntities.decode)(_value2));
      } else if (char == "(") {
        if (lastNode) {
          lastNode = new _TEMethodCall.TEMethodCall(lastNode);
          lastNode.codePosition = partCodePosition;
          this.position++;
          this.skipWhitespace();
          while (this.text[this.position] != ')') {
            if (this.position >= this.text.length) this.throw('Unexpected end of input');
            var _value3 = this.parseNormal(11);
            lastNode.args.push(_value3);
            if (this.text[this.position] == ',') this.position++;
          }
          this.position++;
        } else {
          this.position++;
          var _value4 = this.parseNormal(10);
          lastNode = _value4;
        }
      } else if (char == ")") {
        if (endLevel == 10) {
          this.position++;
          break;
        }
        if (endLevel >= 10) {
          break;
        } else {
          this.throw("( not opened");
        }
      } else if (char == "=") {
        if (this.text[this.position + 1] != "=") {
          this.throw("Assignment '=' is not allowed in expressions");
        }
        if (endLevel >= 40) {
          break;
        }
        this.position += 2;
        var right = this.parseNormal(40);
        lastNode = new _TEEqual.TEEqual(lastNode, right);
      } else if (char == "!" && this.text[this.position + 1] == "=") {
        if (endLevel >= 40) {
          break;
        }
        this.position += 2;
        var _right = this.parseNormal(40);
        lastNode = new TENotEqual(lastNode, _right);
      } else if (char == "&" && this.text[this.position + 1] == "&") {
        if (endLevel >= 20) {
          break;
        }
        this.position += 2;
        var _right2 = this.parseNormal(20);
        lastNode = new _TEAnd.TEAnd(lastNode, _right2);
      } else if (char == "|" && this.text[this.position + 1] == "|") {
        if (endLevel >= 20) {
          break;
        }
        this.position += 2;
        var _right3 = this.parseNormal(20);
        lastNode = new _TEOr.TEOr(lastNode, _right3);
      } else if (char == "?" && this.text[this.position + 1] == "?") {
        if (endLevel >= 20) {
          break;
        }
        this.position += 2;
        var _right4 = this.parseNormal(20);
        lastNode = new _TEOrNull.TEOrNull(lastNode, _right4);
      } else if (char == "+") {
        if (endLevel >= 60) {
          break;
        }
        this.position++;
        var _right5 = this.parseNormal(60);
        lastNode = new _TEAdd.TEAdd(lastNode, _right5);
      } else if (char == "-") {
        if (endLevel >= 60) {
          break;
        }
        this.position++;
        var _right6 = this.parseNormal(60);
        lastNode = new _TESubtract.TESubtract(lastNode, _right6);
      } else if (char == "*") {
        if (endLevel >= 70) {
          break;
        }
        this.position++;
        var _right7 = this.parseNormal(70);
        lastNode = new _TEMultiply.TEMultiply(lastNode, _right7);
      } else if (char == "/") {
        if (endLevel >= 70) {
          break;
        }
        this.position++;
        var _right8 = this.parseNormal(70);
        lastNode = new _TEDivide.TEDivide(lastNode, _right8);
      } else if (char == "%") {
        if (endLevel >= 70) {
          break;
        }
        this.position++;
        var _right9 = this.parseNormal(70);
        lastNode = new _TEModulo.TEModulo(lastNode, _right9);
      } else if (char == "!") {
        if (endLevel > 30) {
          break;
        }
        if (lastNode) {
          this.throw("Unexpected '!'");
        }
        this.position++;
        var _right10 = this.parseNormal(30);
        lastNode = new _TENegate.TENegate(_right10);
      } else if (char == ":") {
        this.position++;
        var _right11 = this.parseNormal(3);
        lastNode = new _TEConcatenate.TEConcatenate(lastNode, _right11);
      } else if (char == ">") {
        if (endLevel == 0 || endLevel == 1) {
          if (lastNode) {
            break;
          } else {
            this.throw("Unexpected character");
          }
        } else {
          //in parenthesis
          if (endLevel >= 40) {
            break;
          }
          this.position++;
          var orEqual = this.text[this.position] == "=";
          if (orEqual) {
            this.position++;
          }
          var _right12 = this.parseNormal(40);
          lastNode = new _TEComparsion.TEComparsion(lastNode, _right12, true, orEqual);
        }
      } else if (char == "<") {
        if (endLevel >= 40) {
          break;
        }
        this.position++;
        var _orEqual = this.text[this.position] == "=";
        if (_orEqual) {
          this.position++;
        }
        var _right13 = this.parseNormal(40);
        lastNode = new _TEComparsion.TEComparsion(lastNode, _right13, false, _orEqual);
      } else {
        if (lastNode) {
          break;
        }
        var _name2 = this.readUntil(/['"\(\)=\.\s:>/+\-*?,]/);
        if (_name2 == 'true') lastNode = new _TEBoolean.TEBoolean(true);else if (_name2 == 'false') lastNode = new _TEBoolean.TEBoolean(false);else lastNode = new _TEVariable.TEVariable(_name2, partCodePosition);
      }
    }
    return lastNode;
  }
}
exports.ExpressionParser = ExpressionParser;