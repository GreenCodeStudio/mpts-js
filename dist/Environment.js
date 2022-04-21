"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Environment = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Environment = /*#__PURE__*/(0, _createClass2["default"])(function Environment() {
  (0, _classCallCheck2["default"])(this, Environment);
  (0, _defineProperty2["default"])(this, "allowExecution", false);
  (0, _defineProperty2["default"])(this, "variables", {});
  (0, _defineProperty2["default"])(this, "document", global.document);
});
exports.Environment = Environment;