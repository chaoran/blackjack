"use strict";

function Deck(cards) {
  this._cards = cards;
  this._next = 0;
}

Deck.prototype.shuffle = function() {
  this._next = 0;
};

Deck.prototype.total = function() {
  return this._cards.length;
};

Deck.prototype.left = function() {
  return this._cards.length - this._next;
};

Deck.prototype.draw = function() {
  var length = this._cards.length;
  var left = length - this._next;

  if (left <= 0) return null;

  var rand = this._next + Math.floor(Math.random() * left);

  /** Swap card from rand to this._next. */
  var temp = this._cards[rand];
  this._cards[rand] = this._cards[this._next];
  this._cards[this._next] = temp;

  /** Return the card at this._next. */
  return this._cards[this._next++];
};

module.exports = Deck;
