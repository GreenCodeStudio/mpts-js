"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqName = getUniqName;
var i = 0;
function getUniqName() {
  return '_' + i++;
}