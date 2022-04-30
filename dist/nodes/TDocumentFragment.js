"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TDocumentFragment = void 0;

var _utils = require("../utils");

var _TNode = require("./TNode");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TDocumentFragment extends _TNode.TNode {
  constructor() {
    super(...arguments);

    _defineProperty(this, "children", []);
  }

  execute(env) {
    var ret = env.document.createDocumentFragment();

    for (var child of this.children) {
      ret.appendChild(child.execute(env));
    }

    return ret;
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createDocumentFragment();';

    for (var child of this.children) {
      var childResult = child.compileJS();
      code += childResult.code;
      code += rootName + ".append(" + childResult.rootName + ");";
    }

    return {
      code,
      rootName
    };
  }

}

exports.TDocumentFragment = TDocumentFragment;