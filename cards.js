"use strict";

var SUITS = require('./suits');

function Card(suit, name) {
  this.suit = suit;
  this.name = name;
}

Card.prototype.toString = function() {
  return this.name + ' ' + this.suit;
};

var cards = new Array(54);

cards[0] = new Card(SUITS.RED, 'Joker');
cards[1] = new Card(SUITS.BLACK, 'Joker');

var CARD_NAMES = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'J', 'Q', 'K', 'A'
];

var CARD_SUITS = [
  SUITS.HEARTS, SUITS.DIAMONDS, SUITS.CLUBS, SUITS.SPADES
];

var k = 2;
for (var i = 0; i < CARD_NAMES.length; ++i) {
  for (var j = 0; j < CARD_SUITS.length; ++j) {
    cards[k++] = new Card(CARD_SUITS[j], CARD_NAMES[i]);
  }
}

module.exports = cards;
