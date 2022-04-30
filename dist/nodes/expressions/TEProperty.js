"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEProperty = void 0;

var _utils = require("../../utils");

var _TEExpression = require("./TEExpression");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEProperty extends _TEExpression.TEExpression {
  constructor(source) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    super();

    _defineProperty(this, "source", "");

    _defineProperty(this, "name", "");

    this.source = source;
    this.name = name;
  }

  execute(env) {
    return this.source.execute(env)[this.name];
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = this.source.compileJS(scopedVariables).code + '[' + JSON.stringify(this.name) + ']';
    return {
      code
    };
  }

}

exports.TEProperty = TEProperty;