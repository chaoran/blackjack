"use strict";
var Deck = require('./lib/Deck');
var allCards = require('./lib/cards');

function Shoe(options) {
  options = options || {};
  var nOfDecks = options.nOfDecks || 1;
  var cards = [];

  for (var i = 0; i < nOfDecks; ++i) {
    /** Make a copy and remove Jokers. */
    var deck = allCards.slice(2);
    cards = cards.concat(deck);
  }

  Deck.call(this, cards);

  var penetration = options.penetration || 0;
  this._limit = Math.floor(penetration * cards.length);
}

Shoe.prototype = Object.create(Deck.prototype);

Shoe.prototype.draw = function() {
  return Deck.prototype.draw.call(this);
};

Shoe.prototype.shuffle = function() {
  if (this._next >= this._limit) {
    Deck.prototype.shuffle.call(this);
  }
};

module.exports = Shoe;
