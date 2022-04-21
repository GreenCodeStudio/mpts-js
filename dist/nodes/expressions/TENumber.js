"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TENumber = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../../utils");

var TENumber = /*#__PURE__*/function () {
  function TENumber() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck2["default"])(this, TENumber);
    (0, _defineProperty2["default"])(this, "value", NaN);
    this.value = +value;
  }

  (0, _createClass2["default"])(TENumber, [{
    key: "execute",
    value: function execute(env) {
      return +this.value;
    }
  }, {
    key: "compileJS",
    value: function compileJS() {
      var code = JSON.stringify(+this.value);
      return {
        code: code
      };
    }
  }]);
  return TENumber;
}();

exports.TENumber = TENumber;