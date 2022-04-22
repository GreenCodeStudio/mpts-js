"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TLoop = void 0;

var _TNode = require("./TNode");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TLoop extends _TNode.TNode {
  constructor(count) {
    super();

    _defineProperty(this, "children", []);

    this.count = count;
  }

  execute(env) {
    var ret = env.document.createDocumentFragment();
    var count = this.count.execute(env);

    for (var i = 0; i < count; i++) {
      for (var child of this.children) {
        ret.appendChild(child.execute(env));
      }
    }

    return ret;
  }

}

exports.TLoop = TLoop;