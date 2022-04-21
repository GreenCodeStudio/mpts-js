"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEBoolean = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../../utils");

var TEBoolean = /*#__PURE__*/function () {
  function TEBoolean() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, _classCallCheck2["default"])(this, TEBoolean);
    (0, _defineProperty2["default"])(this, "value", false);
    this.value = value;
  }

  (0, _createClass2["default"])(TEBoolean, [{
    key: "execute",
    value: function execute(env) {
      return !!this.value;
    }
  }, {
    key: "compileJS",
    value: function compileJS() {
      var code = this.value ? 'true' : 'false';
      return {
        code: code
      };
    }
  }]);
  return TEBoolean;
}();

exports.TEBoolean = TEBoolean;