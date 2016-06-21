"use strict";
var Deck = require('./lib/Deck');
var allCards = require('./lib/cards');

function Shoe(options) {
  var nOfDecks = options.nOfDecks || 8;
  var cards = [];

  for (var i = 0; i < nOfDecks; ++i) {
    /** Make a copy and remove Jokers. */
    var deck = allCards.slice(2);
    cards = cards.concat(deck);
  }

  var penetration = options.penetration || 0.5;
  this._limit = Math.floor(penetration * cards.length);

  Deck.call(this, cards);
}

Shoe.prototype = Object.create(Deck.prototype);

Shoe.prototype.draw = function() {
  if (this._next >= this._limit) this.shuffle();
  Deck.prototype.draw.call(this);
};

module.exports = Shoe;
