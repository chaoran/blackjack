"use strict";
var Deck = require('./lib/Deck');
var allCards = require('./lib/cards');

function Shoe(game, options) {
  var nOfDecks = options.nOfDecks || 8;
  var cards = [];

  for (var i = 0; i < nOfDecks; ++i) {
    /** Make a copy and remove Jokers. */
    var deck = allCards.slice(2);
    cards = cards.concat(deck);
  }

  Deck.call(this, cards);

  if (game) {
    var penetration = options.penetration || 0.5;
    var limit = Math.floor(penetration * cards.length);
    var that = this;

    game.on('start', function() {
      if (that._next >= limit) that.shuffle();
    });
  }
}

Shoe.prototype = Object.create(Deck.prototype);

Shoe.prototype.draw = function() {
  Deck.prototype.draw.call(this);
};

module.exports = Shoe;
