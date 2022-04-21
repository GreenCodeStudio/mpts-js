"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionParser = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _TDocumentFragment = require("../nodes/TDocumentFragment");

var _TEVariable = require("../nodes/expressions/TEVariable");

var _TEBoolean = require("../nodes/expressions/TEBoolean");

var _TENumber = require("../nodes/expressions/TENumber");

var _TEString = require("../nodes/expressions/TEString");

var _TEEqual = require("../nodes/expressions/TEEqual");

var _AbstractParser2 = require("./AbstractParser");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ExpressionParser = /*#__PURE__*/function (_AbstractParser) {
  (0, _inherits2["default"])(ExpressionParser, _AbstractParser);

  var _super = _createSuper(ExpressionParser);

  function ExpressionParser(text) {
    var _this;

    (0, _classCallCheck2["default"])(this, ExpressionParser);
    _this = _super.call(this);
    _this.text = text;
    _this.position = 0;
    return _this;
  }

  (0, _createClass2["default"])(ExpressionParser, [{
    key: "parseNormal",
    value: function parseNormal() {
      var endLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var lastNode = null;

      while (this.position < this.text.length) {
        var _char = this.text[this.position];

        if (/\s/.test(_char)) {
          this.position++;
        } else if (/[0-9\.\-+]/.test(_char)) {
          var value = this.readUntill(/\s/);
          lastNode = new _TENumber.TENumber(+value);
        } else if (_char == '"') {
          this.position++;

          var _value = this.readUntill(/"/);

          this.position++;
          lastNode = new _TEString.TEString(_value);
        } else if (_char == "'") {
          this.position++;

          var _value2 = this.readUntill(/'/);

          this.position++;
          lastNode = new _TEString.TEString(_value2);
        } else if (_char == "(") {
          this.position++;

          var _value3 = this.parseNormal(1);

          this.position++;
          lastNode = _value3;
        } else if (_char == ")") {
          if (endLevel >= 1) {
            break;
          } else {
            throw new Error("( not opened");
          }
        } else if (_char == "=" && this.text[this.position + 1] == "=") {
          this.position += 2;
          var right = this.parseNormal(2);
          lastNode = new _TEEqual.TEEqual(lastNode, right);
        } else {
          var name = this.readUntill(/['"\(\)=\s]/);
          if (name == 'true') lastNode = new _TEBoolean.TEBoolean(true);else if (name == 'false') lastNode = new _TEBoolean.TEBoolean(false);else lastNode = new _TEVariable.TEVariable(name);
        }
      }

      return lastNode;
    }
  }], [{
    key: "Parse",
    value: function Parse(text) {
      return new ExpressionParser(text).parseNormal();
    }
  }]);
  return ExpressionParser;
}(_AbstractParser2.AbstractParser);

exports.ExpressionParser = ExpressionParser;