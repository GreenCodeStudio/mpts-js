"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TForeach = void 0;

var _TNode = require("./TNode");

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
        ret.appendChild(child.execute(envScoped));
      }

      i++;
    }

    return ret;
  }

}

exports.TForeach = TForeach;