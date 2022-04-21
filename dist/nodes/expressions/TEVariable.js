"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEVariable = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../../utils");

var TEVariable = /*#__PURE__*/function () {
  function TEVariable() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    (0, _classCallCheck2["default"])(this, TEVariable);
    (0, _defineProperty2["default"])(this, "name", "");
    this.name = name;
  }

  (0, _createClass2["default"])(TEVariable, [{
    key: "execute",
    value: function execute(env) {
      return env.variables[this.name];
    }
  }, {
    key: "compileJS",
    value: function compileJS() {
      var code = 'variables[' + JSON.stringify(this.name) + ']';
      return {
        code: code
      };
    }
  }]);
  return TEVariable;
}();

exports.TEVariable = TEVariable;