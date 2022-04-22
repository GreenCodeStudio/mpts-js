"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TComment = void 0;

var _utils = require("../utils");

var _he = _interopRequireDefault(require("he"));

var _TNode = require("./TNode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TComment extends _TNode.TNode {
  constructor() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    super();

    _defineProperty(this, "text", "");

    this.text = text;
  }

  execute(env) {
    return env.document.createComment(_he.default.decode(this.text));
  }

  compileJS() {
    var rootName = (0, _utils.getUniqName)();
    var code = 'const ' + rootName + '=document.createComment(' + JSON.stringify(_he.default.decode(this.text)) + ');';
    return {
      code,
      rootName
    };
  }

}

exports.TComment = TComment;