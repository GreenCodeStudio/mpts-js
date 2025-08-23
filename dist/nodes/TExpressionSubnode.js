"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TExpressionSubnode = void 0;
var _TNode = require("./TNode.js");
class TExpressionSubnode extends _TNode.TNode {
  execute(env) {
    var frag = env.document.createDocumentFragment();
    var div = env.document.createElement('div');
    div.innerHTML = this.expression.execute(env);
    frag.append(...div.childNodes);
    return frag;
  }
}
exports.TExpressionSubnode = TExpressionSubnode;