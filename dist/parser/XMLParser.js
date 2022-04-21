"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLParser = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _TDocumentFragment = require("../nodes/TDocumentFragment");

var _TText = require("../nodes/TText");

var _TElement = require("../nodes/TElement");

var _importMetaResolve = require("@babel/core/lib/vendor/import-meta-resolve");

var _TEVariable = require("../nodes/expressions/TEVariable");

var _TExpressionText = require("../nodes/TExpressionText");

var _TAttribute = require("../nodes/TAttribute");

var _TIf = require("../nodes/TIf");

var _ExpressionParser = require("./ExpressionParser");

var _TEString = require("../nodes/expressions/TEString");

var _AbstractParser2 = require("./AbstractParser");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var XMLParser = /*#__PURE__*/function (_AbstractParser) {
  (0, _inherits2["default"])(XMLParser, _AbstractParser);

  var _super = _createSuper(XMLParser);

  function XMLParser(text) {
    var _this;

    (0, _classCallCheck2["default"])(this, XMLParser);
    _this = _super.call(this);
    _this.text = text;
    _this.position = 0;
    _this.openElements = [new _TDocumentFragment.TDocumentFragment()];
    return _this;
  }

  (0, _createClass2["default"])(XMLParser, [{
    key: "parseNormal",
    value: function parseNormal() {
      while (this.position < this.text.length) {
        var _char = this.text[this.position];
        var element = this.openElements[this.openElements.length - 1];
        var last = element.children[element.children.length - 1];

        if (_char == '<') {
          if (this.text[this.position + 1] == '/') {
            this.position += 2;
            var name = this.parseElementEnd();

            if (name.startsWith(':')) {
              this.closeSpecialElement(name, this.openElements);
            } else if (element instanceof _TElement.TElement && element.tagName == name) {
              this.openElements.pop();
            } else {
              throw new Error("Element <".concat(name, "> not opened as last"));
            }
          } else {
            this.position++;
            var result = this.parseElement();

            if (result.element.tagName.startsWith(':')) {
              this.convertToSpecialElement(result, element);
            } else {
              element.children.push(result.element);
              if (!result.autoclose) this.openElements.push(result.element);
            }
          }
        } else if (_char == '{' && this.text[this.position + 1] == '{') {
          this.position += 2;

          var _result = this.parseExpression('}}');

          var node = new _TExpressionText.TExpressionText();
          node.expression = _result;
          element.children.push(node);
        } else {
          if (!last || !(last instanceof _TText.TText)) {
            last = new _TText.TText();
            element.children.push(last);
          }

          last.text += _char;
          this.position++;
        }
      }

      return this.openElements[0];
    }
  }, {
    key: "parseElement",
    value: function parseElement() {
      var autoclose = false;
      var element = new _TElement.TElement();
      element.parsePosition = this.position;

      while (this.position < this.text.length) {
        var _char2 = this.text[this.position];
        if (_char2 == '>' || _char2 == ' ' || _char2 == '/') break;
        element.tagName += _char2;
        this.position++;
      }

      while (this.position < this.text.length) {
        var _char3 = this.text[this.position];

        if (_char3 == '>') {
          this.position++;
          break;
        } else if (_char3 == '/') {
          this.position++;
          autoclose = true;
        } else if (/\s/.test(_char3)) {
          this.position++;
        } else {
          var name = this.readUntill(/[\s=]/);
          var value = null;
          this.skipWhitespace();
          _char3 = this.text[this.position];

          if (_char3 == '=') {
            this.position++;
            this.skipWhitespace();
            var char2 = this.text[this.position];

            if (char2 == '"') {
              this.position++;
              value = new _TEString.TEString(this.readUntill(/"/));
              this.position++;
            } else if (char2 == "'") {
              this.position++;
              value = new _TEString.TEString(this.readUntill(/'/));
              this.position++;
            } else if (char2 == "(") {
              this.position++;
              value = _ExpressionParser.ExpressionParser.Parse(this.readUntill(/\)/));
              this.position++;
            } else {
              value = _ExpressionParser.ExpressionParser.Parse(this.readUntill(/[\s>/]/));
            }
          }

          element.attributes.push(new _TAttribute.TAttribute(name, value));
        }
      }

      return {
        element: element,
        autoclose: autoclose
      };
    }
  }, {
    key: "parseElementEnd",
    value: function parseElementEnd() {
      var name = "";

      while (this.position < this.text.length) {
        var _char4 = this.text[this.position];
        if (_char4 == '>' || _char4 == ' ' || _char4 == '/') break;
        name += _char4;
        this.position++;
      }

      while (this.position < this.text.length) {
        var _char5 = this.text[this.position];

        if (_char5 == '>') {
          this.position++;
          break;
        }

        this.position++;
      }

      return name;
    }
  }, {
    key: "parseExpression",
    value: function parseExpression(end) {
      var text = "";

      while (this.position < this.text.length) {
        if (this.text.substring(this.position, this.position + end.length) == end) {
          this.position += end.length;
          break;
        }

        text += this.text[this.position];
        this.position++;
      }

      return _ExpressionParser.ExpressionParser.Parse(text);
    }
  }, {
    key: "convertToSpecialElement",
    value: function convertToSpecialElement(result, element) {
      if (result.element.tagName.toLowerCase() == ':if') {
        var node = new _TIf.TIf();
        var expression = result.element.attributes.find(function (x) {
          return x.name == 'condition';
        }).expression;
        node.conditions.push({
          expression: expression,
          children: []
        });
        element.children.push(node);
        if (!result.autoclose) this.openElements.push(node);
      } else if (result.element.tagName.toLowerCase() == ':else-if') {
        var last = element.children[element.children.length - 1];
        if (!(last instanceof _TIf.TIf && last["else"] == null)) throw new Error("need if before else-if");
        var _expression = result.element.attributes.find(function (x) {
          return x.name == 'condition';
        }).expression;
        last.conditions.push({
          expression: _expression,
          children: []
        });
        if (!result.autoclose) this.openElements.push(last);
      } else if (result.element.tagName.toLowerCase() == ':else') {
        var _last = element.children[element.children.length - 1];
        if (!(_last instanceof _TIf.TIf && _last["else"] == null)) throw new Error("need if before else");
        _last["else"] = {
          children: []
        };
        if (!result.autoclose) this.openElements.push(_last);
      }
    }
  }, {
    key: "closeSpecialElement",
    value: function closeSpecialElement(tagName, openElements) {
      var last = openElements[openElements.length - 1];

      if (tagName.toLowerCase() == ':if') {
        if (last instanceof _TIf.TIf && last.conditions.length == 1 && last["else"] == null) {
          openElements.pop();
        } else {
          throw new Error("Last opened element is not <:if>");
        }
      } else if (tagName.toLowerCase() == ':else-if') {
        if (last instanceof _TIf.TIf && last.conditions.length > 1 && last["else"] == null) {
          openElements.pop();
        } else {
          throw new Error("Last opened element is not <:else-if>");
        }
      } else if (tagName.toLowerCase() == ':else') {
        if (last instanceof _TIf.TIf && last["else"] != null) {
          openElements.pop();
        } else {
          throw new Error("Last opened element is not <:else>");
        }
      }
    }
  }], [{
    key: "Parse",
    value: function Parse(text) {
      return new XMLParser(text).parseNormal();
    }
  }]);
  return XMLParser;
}(_AbstractParser2.AbstractParser);

exports.XMLParser = XMLParser;