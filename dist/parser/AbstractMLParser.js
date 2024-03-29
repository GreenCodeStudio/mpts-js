"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractMLParser = void 0;

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

class AbstractMLParser extends _AbstractParser.AbstractParser {
  constructor(text) {
    super();
    this.text = text;
    this.position = 0;
    this.openElements = [new _TDocumentFragment.TDocumentFragment()];
  }

  parseNormal() {
    var _this = this;

    while (this.position < this.text.length) {
      var positionCopy = this.position;
      var char = this.text[this.position];
      var element = this.openElements[this.openElements.length - 1];
      var last = element.children[element.children.length - 1];

      if (char == '<') {
        if (this.text.substr(this.position, 4) == '<!--') {
          this.position += 4;
          var text = this.readUntilText('-->');
          this.position += 3;
          element.children.push(new _TComment.TComment(text));
        } else if (this.text[this.position + 1] == '/') {
          (function () {
            _this.position += 2;

            var name = _this.parseElementEnd();

            if (name.startsWith(':')) {
              _this.closeSpecialElement(name, _this.openElements);
            } else if (element instanceof _TElement.TElement && element.tagName == name) {
              _this.openElements.pop();
            } else if (_this.allowAutoClose && _this.openElements.some(e => e instanceof _TElement.TElement && e.tagName == name)) {
              _this.openElements.reverse();

              var closing = _this.openElements.find(e => e instanceof _TElement.TElement && e.tagName == name);

              _this.openElements.splice(0, _this.openElements.indexOf(closing) + 1);

              _this.openElements.reverse();
            } else {
              _this.position = positionCopy;

              _this.throw("Last opened element is not <".concat(name, ">"));
            }
          })();
        } else {
          this.position++;
          var result = this.parseElement();

          if (result.element.tagName.startsWith(':')) {
            this.convertToSpecialElement(result, element);
          } else {
            element.children.push(result.element);
            if (!result.autoclose && !this.voidElements.includes(result.element.tagName.toLowerCase())) this.openElements.push(result.element);
          }
        }
      } else if (char == '{' && this.text[this.position + 1] == '{') {
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

        last.text += char;
        this.position++;
      }
    }

    if (this.openElements.length > 1 && !this.allowAutoClose) {
      this.throw("Element <".concat(this.openElements[this.openElements.length - 1].tagName, "> not closed"));
    }

    return this.openElements[0];
  }

  parseElement() {
    var autoclose = false;
    var element = new _TElement.TElement();
    element.parsePosition = this.position;

    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (char == '>' || char == ' ' || char == '/') break;
      element.tagName += char;
      this.position++;
    }

    while (this.position < this.text.length) {
      var _char = this.text[this.position];

      if (_char == '>') {
        this.position++;
        break;
      } else if (_char == '/') {
        this.position++;
        autoclose = true;
      } else if (/\s/.test(_char)) {
        this.position++;
      } else {
        var name = this.readUntil(/[\s=/]/);
        var value = null;
        this.skipWhitespace();
        _char = this.text[this.position];

        if (_char == '=') {
          this.position++;
          this.skipWhitespace();
          var char2 = this.text[this.position];
          var parser = new _ExpressionParser.ExpressionParser(this.text.substring(this.position));
          value = parser.parseNormal();
          this.position += parser.position;
        }

        element.attributes.push(new _TAttribute.TAttribute(name, value));
      }
    }

    return {
      element,
      autoclose
    };
  }

  parseElementEnd() {
    var name = "";

    while (this.position < this.text.length) {
      var char = this.text[this.position];
      if (char == '>' || char == ' ' || char == '/') break;
      name += char;
      this.position++;
    }

    while (this.position < this.text.length) {
      var _char2 = this.text[this.position];

      if (_char2 == '>') {
        this.position++;
        break;
      }

      this.position++;
    }

    return name;
  }

  parseExpression(end) {
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

  convertToSpecialElement(result, element) {
    if (result.element.tagName.toLowerCase() == ':if') {
      var node = new _TIf.TIf();
      var expression = result.element.attributes.find(x => x.name == 'condition').expression;
      node.conditions.push({
        expression,
        children: []
      });
      element.children.push(node);
      if (!result.autoclose) this.openElements.push(node);
    } else if (result.element.tagName.toLowerCase() == ':else-if') {
      var last = element.children[element.children.length - 1];
      if (!(last instanceof _TIf.TIf && last.else == null)) this.throw("need if before else-if");
      var _expression = result.element.attributes.find(x => x.name == 'condition').expression;
      last.conditions.push({
        expression: _expression,
        children: []
      });
      if (!result.autoclose) this.openElements.push(last);
    } else if (result.element.tagName.toLowerCase() == ':else') {
      var _last = element.children[element.children.length - 1];
      if (!(_last instanceof _TIf.TIf && _last.else == null)) this.throw("need if before else");
      _last.else = {
        children: []
      };
      if (!result.autoclose) this.openElements.push(_last);
    } else if (result.element.tagName.toLowerCase() == ':loop') {
      var count = result.element.attributes.find(x => x.name == 'count').expression;

      var _node = new _TLoop.TLoop(count);

      element.children.push(_node);
      if (!result.autoclose) this.openElements.push(_node);
    } else if (result.element.tagName.toLowerCase() == ':foreach') {
      var _result$element$attri, _result$element$attri2;

      var collection = result.element.attributes.find(x => x.name == 'collection').expression;
      var item = (_result$element$attri = result.element.attributes.find(x => x.name == 'item')) === null || _result$element$attri === void 0 ? void 0 : _result$element$attri.expression.name;
      var key = (_result$element$attri2 = result.element.attributes.find(x => x.name == 'key')) === null || _result$element$attri2 === void 0 ? void 0 : _result$element$attri2.expression.name;

      var _node2 = new _TForeach.TForeach(collection, item, key);

      element.children.push(_node2);
      if (!result.autoclose) this.openElements.push(_node2);
    }
  }

  closeSpecialElement(tagName) {
    tagName = tagName.toLowerCase();
    var last = this.openElements[this.openElements.length - 1];

    if (tagName == ':if') {
      if (last instanceof _TIf.TIf && last.conditions.length == 1 && last.else == null) {
        this.openElements.pop();
      } else {
        this.throw("Last opened element is not <:if>");
      }
    } else if (tagName == ':else-if') {
      if (last instanceof _TIf.TIf && last.conditions.length > 1 && last.else == null) {
        this.openElements.pop();
      } else {
        this.throw("Last opened element is not <:else-if>");
      }
    } else if (tagName == ':else') {
      if (last instanceof _TIf.TIf && last.else != null) {
        this.openElements.pop();
      } else {
        this.throw("Last opened element is not <:else>");
      }
    } else if (tagName == ':loop') {
      if (last instanceof _TLoop.TLoop) {
        this.openElements.pop();
      } else {
        this.throw("Last opened element is not <:loop>");
      }
    } else if (tagName == ':foreach') {
      if (last instanceof _TForeach.TForeach) {
        this.openElements.pop();
      } else {
        this.throw("Last opened element is not <:foreach>");
      }
    }
  }

}

exports.AbstractMLParser = AbstractMLParser;
