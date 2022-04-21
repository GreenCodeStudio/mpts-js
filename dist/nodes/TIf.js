"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIf = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var TIf = /*#__PURE__*/function () {
  function TIf() {
    (0, _classCallCheck2["default"])(this, TIf);
    (0, _defineProperty2["default"])(this, "conditions", []);
    (0, _defineProperty2["default"])(this, "else", null);
  }

  (0, _createClass2["default"])(TIf, [{
    key: "execute",
    value: function execute(env) {
      var _iterator = _createForOfIteratorHelper(this.conditions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var condition = _step.value;

          if (condition.expression.execute(env)) {
            return this.executeCondition(condition, env);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (this["else"]) {
        return this.executeCondition(this["else"], env);
      }

      return null;
    }
  }, {
    key: "executeCondition",
    value: function executeCondition(condition, env) {
      if (condition.children.length == 1) return condition.children[0].execute(env);
      var ret = env.document.createDocumentFragment();

      var _iterator2 = _createForOfIteratorHelper(condition.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var child = _step2.value;
          ret.appendChild(child.execute(env));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return ret;
    }
  }, {
    key: "compileJS",
    value: function compileJS() {
      var rootName = (0, _utils.getUniqName)();
      var code = 'let ' + rootName + ';'; // for (const condition of this.conditions) {
      //     let childResult = child.compileJS();
      //     code += childResult.code;
      //     code += rootName + ".append(" + childResult.rootName + ");"
      // }

      return {
        code: code,
        rootName: rootName
      };
    }
  }, {
    key: "children",
    get: function get() {
      if (this["else"]) return this["else"].children;else return this.conditions[this.conditions.length - 1].children;
    }
  }]);
  return TIf;
}();

exports.TIf = TIf;