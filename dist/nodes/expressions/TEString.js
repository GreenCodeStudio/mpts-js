"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEString = void 0;

var _utils = require("../../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEString {
  constructor() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    _defineProperty(this, "value", "");

    this.value = "" + value;
  }

  execute(env) {
    return "" + this.value;
  }

  compileJS() {
    var code = JSON.stringify("" + this.value);
    return {
      code
    };
  }

}

exports.TEString = TEString;