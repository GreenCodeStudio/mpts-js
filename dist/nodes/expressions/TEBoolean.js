"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEBoolean = void 0;

var _utils = require("../../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TEBoolean {
  constructor() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _defineProperty(this, "value", false);

    this.value = value;
  }

  execute(env) {
    return !!this.value;
  }

  compileJS() {
    var code = this.value ? 'true' : 'false';
    return {
      code
    };
  }

}

exports.TEBoolean = TEBoolean;