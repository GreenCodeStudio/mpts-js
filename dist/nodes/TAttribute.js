"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TAttribute = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var TAttribute = /*#__PURE__*/(0, _createClass2["default"])(function TAttribute(name, expression) {
  (0, _classCallCheck2["default"])(this, TAttribute);
  this.name = name;
  this.expression = expression;
});
exports.TAttribute = TAttribute;