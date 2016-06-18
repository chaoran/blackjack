"use strict";

var COLORS = require('./colors');

function Suit(color, name) {
  this.color = color;
  this.name = name;
}

Suit.prototype.toString = function() {
  if (this.name === undefined)
    return this.color.toString();
  else
    return this.name;
};

module.exports = {
  RED: new Suit(COLORS.RED),
  HEARTS: new Suit(COLORS.RED, 'Hearts'),
  DIAMONDS: new Suit(COLORS.RED, 'Diamonds'),

  BLACK: new Suit(COLORS.BLACK),
  CLUBS: new Suit(COLORS.BLACK, 'Clubs'),
  SPADES: new Suit(COLORS.BLACK, 'Spades')
};
