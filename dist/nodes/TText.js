"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TText = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../utils");

var _he = _interopRequireDefault(require("he"));

var TText = /*#__PURE__*/function () {
  function TText() {
    (0, _classCallCheck2["default"])(this, TText);
    (0, _defineProperty2["default"])(this, "text", "");
  }

  (0, _createClass2["default"])(TText, [{
    key: "execute",
    value: function execute(env) {
      return env.document.createTextNode(_he["default"].decode(this.text));
    }
  }, {
    key: "compileJS",
    value: function compileJS() {
      var rootName = (0, _utils.getUniqName)();
      var code = 'const ' + rootName + '=document.createTextNode(' + JSON.stringify(_he["default"].decode(this.text)) + ');';
      return {
        code: code,
        rootName: rootName
      };
    }
  }]);
  return TText;
}();

exports.TText = TText;