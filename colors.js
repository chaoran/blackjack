"use strict";

function Color(name) {
  this.name = name;
}

Color.prototype.toString = function() {
  return this.name;
};

module.exports = {
  RED: new Color('Red'),
  BLACK: new Color('Black')
};
