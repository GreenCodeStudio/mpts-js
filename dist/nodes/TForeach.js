"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TForeach = void 0;

var _TNode = require("./TNode");

var _utils = require("../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TForeach extends _TNode.TNode {
  constructor(collection) {
    var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    super();

    _defineProperty(this, "children", []);

    this.collection = collection;
    this.item = item;
    this.key = key;
  }

  execute(env) {
    var ret = env.document.createDocumentFragment();
    var collection = this.collection.execute(env);
    var i = 0;

    for (var x of collection) {
      for (var child of this.children) {
        var envScoped = env.scope();
        if (this.item) envScoped.variables[this.item] = x;
        if (this.key) envScoped.variables[this.key] = i;
        var result = child.execute(envScoped);
        if (result) ret.appendChild(result);
      }

      i++;
    }

    return ret;
  }

  compileJS() {
    var scopedVariables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
    var rootName = (0, _utils.getUniqName)();
    var code = 'let ' + rootName + '=document.createDocumentFragment();';
    code += 'for(let [_foreachKey,_foreachValue] of Object.entries(' + this.collection.compileJS().code + ')){';
    var subScope = new Set(Array.from(scopedVariables));

    if (this.key) {
      code += 'let ' + this.key + ' = _foreachKey;';
      subScope.add(this.key);
    }

    if (this.item) {
      code += 'let ' + this.item + ' = _foreachValue;';
      subScope.add(this.item);
    }

    for (var child of this.children) {
      var childResult = child.compileJS(subScope);
      code += childResult.code;
      code += rootName + ".append(" + childResult.rootName + ");";
    }

    code += '}';
    return {
      code,
      rootName
    };
  }

}

exports.TForeach = TForeach;