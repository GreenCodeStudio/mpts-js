"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEOrNull = void 0;

var _TEExpression = require("./TEExpression");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEOrNull extends _TEExpression.TEExpression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  execute(env) {
    var subEnv = _objectSpread(_objectSpread({}, env), {}, {
      allowUndefined: true
    });

    var left = this.left.execute(subEnv);

    if (left != null) {
      return left;
    } else {
      return this.right.execute(env);
    }
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = '(';
    code += this.left.compileJS(scopedVariables).code;
    code += '??';
    code += this.right.compileJS(scopedVariables).code;
    code += ')';
    return {
      code
    };
  }

}

exports.TEOrNull = TEOrNull;