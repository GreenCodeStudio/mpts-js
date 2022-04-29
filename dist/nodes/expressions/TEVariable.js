"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEVariable = void 0;

var _utils = require("../../utils");

var _TEExpression = require("./TEExpression");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEVariable extends _TEExpression.TEExpression {
  constructor() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    super();

    _defineProperty(this, "name", "");

    this.name = name;
  }

  execute(env) {
    return env.variables[this.name];
  }

  compileJS() {
    var code = 'variables[' + JSON.stringify(this.name) + ']';
    return {
      code
    };
  }

}

exports.TEVariable = TEVariable;