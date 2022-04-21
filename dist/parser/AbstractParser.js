"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractParser = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var AbstractParser = /*#__PURE__*/function () {
  function AbstractParser() {
    (0, _classCallCheck2["default"])(this, AbstractParser);
  }

  (0, _createClass2["default"])(AbstractParser, [{
    key: "readUntill",
    value: function readUntill(regexp) {
      var ret = '';

      while (this.position < this.text.length) {
        var _char = this.text[this.position];
        if (regexp.test(_char)) break;
        ret += _char;
        this.position++;
      }

      return ret;
    }
  }, {
    key: "skipWhitespace",
    value: function skipWhitespace() {
      this.readUntill(/\S/);
    }
  }]);
  return AbstractParser;
}();

exports.AbstractParser = AbstractParser;