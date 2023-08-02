"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TElement = void 0;

var _utils = require("../utils");

var _TNode = require("./TNode");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TElement extends _TNode.TNode {
  constructor() {
    super(...arguments);

    _defineProperty(this, "tagName", "");

    _defineProperty(this, "children", []);

    _defineProperty(this, "attributes", []);
  }

  execute(env) {
    var ret = env.document.createElement(this.tagName);

    for (var attr of this.attributes) {
      if (attr.expression) {
        var value = attr.expression.execute(env);
        if (typeof value === 'function') ret[attr.name] = value;else ret.setAttribute(attr.name, attr.expression.execute(env));
      } else ret.setAttribute(attr.name, attr.name);
    }

    for (var child of this.children) {
      ret.appendChild(child.execute(env));
    }

    return ret;
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createElement(' + JSON.stringify(this.tagName) + ');';

    for (var attr of this.attributes) {
      if (attr.expression) {
        var attrValueName = (0, _utils.getUniqName)();
        code += 'const ' + attrValueName + '=' + attr.expression.compileJS(scopedVariables).code + ';';
        code += "if(typeof ".concat(attrValueName, "==='function')").concat(rootName, "[").concat(JSON.stringify(attr.name), "]=").concat(attrValueName, ";else ").concat(rootName, ".setAttribute(").concat(JSON.stringify(attr.name), ",").concat(attrValueName, ");");
      } else code += rootName + ".setAttribute(" + JSON.stringify(attr.name) + ", " + JSON.stringify(attr.name) + ");";
    }

    for (var child of this.children) {
      var childResult = child.compileJS(scopedVariables);
      code += childResult.code;
      code += rootName + ".append(" + childResult.rootName + ");";
    }

    return {
      code,
      rootName
    };
  }

}

exports.TElement = TElement;