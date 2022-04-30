"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionParser = void 0;

var _TDocumentFragment = require("../nodes/TDocumentFragment");

var _TEVariable = require("../nodes/expressions/TEVariable");

var _TEBoolean = require("../nodes/expressions/TEBoolean");

var _TENumber = require("../nodes/expressions/TENumber");

var _TEString = require("../nodes/expressions/TEString");

var _TEEqual = require("../nodes/expressions/TEEqual");

var _AbstractParser = require("./AbstractParser");

var _TEProperty = require("../nodes/expressions/TEProperty");

class ExpressionParser extends _AbstractParser.AbstractParser {
  constructor(text) {
    super();
    this.text = text;
    this.position = 0;
  }

  static Parse(text) {
    return new ExpressionParser(text).parseNormal();
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
        var name = this.readUntill(/['"\(\)=\.\s]/);
        lastNode = new _TEProperty.TEProperty(lastNode, name);
      } else if (/[0-9\.\-+]/.test(char)) {
        var value = this.readUntill(/\s/);
        lastNode = new _TENumber.TENumber(+value);
      } else if (char == '"') {
        this.position++;

        var _value = this.readUntill(/"/);

        this.position++;
        lastNode = new _TEString.TEString(_value);
      } else if (char == "'") {
        this.position++;

        var _value2 = this.readUntill(/'/);

        this.position++;
        lastNode = new _TEString.TEString(_value2);
      } else if (char == "(") {
        this.position++;

        var _value3 = this.parseNormal(1);

        this.position++;
        lastNode = _value3;
      } else if (char == ")") {
        if (endLevel >= 1) {
          break;
        } else {
          throw new Error("( not opened");
        }
      } else if (char == "=" && this.text[this.position + 1] == "=") {
        this.position += 2;
        var right = this.parseNormal(2);
        lastNode = new _TEEqual.TEEqual(lastNode, right);
      } else {
        var _name = this.readUntill(/['"\(\)=\.\s]/);

        if (_name == 'true') lastNode = new _TEBoolean.TEBoolean(true);else if (_name == 'false') lastNode = new _TEBoolean.TEBoolean(false);else lastNode = new _TEVariable.TEVariable(_name);
      }
    }

    return lastNode;
  }

}

exports.ExpressionParser = ExpressionParser;