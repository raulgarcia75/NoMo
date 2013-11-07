exports.inherits = inherits;

function inherits(child, parent) {
  child.super_ = parent;
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}