"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Environment = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Environment {
  constructor() {
    _defineProperty(this, "allowExecution", false);

    _defineProperty(this, "variables", {});

    _defineProperty(this, "document", global.document);
  }

  scope() {
    var newVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var ret = new Environment();
    ret.allowExecution = this.allowExecution;
    ret.variables = Object.create(this.variables);
    ret.document = this.document;
    Object.assign(ret.variables, newVariables);
    return ret;
  }

}

exports.Environment = Environment;