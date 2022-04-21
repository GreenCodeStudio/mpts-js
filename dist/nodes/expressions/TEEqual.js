"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEEqual = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var TEEqual = /*#__PURE__*/function () {
  function TEEqual(left, right) {
    (0, _classCallCheck2["default"])(this, TEEqual);
    this.left = left;
    this.right = right;
  }

  (0, _createClass2["default"])(TEEqual, [{
    key: "execute",
    value: function execute(env) {
      return this.left.execute(env) == this.right.execute(env);
    }
  }]);
  return TEEqual;
}();

exports.TEEqual = TEEqual;