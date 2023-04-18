"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEMethodCall = void 0;

var _utils = require("../../utils");

var _TEExpression = require("./TEExpression");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEMethodCall extends _TEExpression.TEExpression {
  constructor(source) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    super();

    _defineProperty(this, "source", "");

    _defineProperty(this, "args", []);

    this.source = source;
    this.args = [];
  }

  execute(env) {
    return this.source.execute(env)(...this.args.map(x => x.execute(env)));
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var code = this.source.compileJS(scopedVariables).code;
    code += '(';
    code += this.args.map(x => x.compileJS(scopedVariables).code).join(',');
    code += ')';
    return {
      code
    };
  }

}

exports.TEMethodCall = TEMethodCall;