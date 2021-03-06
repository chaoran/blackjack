"use strict";

var EventEmitter = require('events');

function Hand() {
  var hidden;

  this.hide = function(card) {
    hidden = card;
  };

  this.reveal = function() {
    if (hidden !== undefined) {
      this.push(hidden);
      hidden = undefined;
    }
  };

  this.cards = [];
  EventEmitter.call(this);
}

Hand.prototype = Object.create(EventEmitter.prototype, {
  constructor: Hand
});

Hand.prototype._eval = function() {
  var point = 0;
  var nAces = 0;

  for (var i = 0; i < this.cards.length; ++i) {
    var card = this.cards[i];

    switch (card.name) {
      case 'A': {
        point += 11;
        nAces += 1; break;
      }
      case '2': point += 2; break;
      case '3': point += 3; break;
      case '4': point += 4; break;
      case '5': point += 5; break;
      case '6': point += 6; break;
      case '7': point += 7; break;
      case '8': point += 8; break;
      case '9': point += 9; break;
      case '10': point += 10; break;
      case 'J': point += 10; break;
      case 'Q': point += 10; break;
      case 'K': point += 10; break;
      default:
        throw new Error("Unknown card: " + card);
    }

    while (point > 21 && nAces-- > 0) point -= 10;
  }

  this.point = point;
  this.soft = (nAces > 0);
  this.blackjack = (this.cards.length === 2 && point === 21);
  this.busted = (point > 21);
};

/**
 * Make 'point', 'soft', 'blackjack', 'busted' lazily calculated
 * properties.
 */
function lazyEval(property) {
  return {
    configurable: true,
    enumerable: true,
    get: function() {
      this._eval();
      return this[property];
    },
    set: function(value) {
      Object.defineProperty(this, property, {
        value: value,
        configurable: true,
        enumerable: true,
        writable: false
      });
    }
  };
}

Object.defineProperties(Hand.prototype, {
  point: lazyEval('point'),
  soft: lazyEval('soft'),
  blackjack: lazyEval('blackjack'),
  busted: lazyEval('busted')
});

Hand.prototype._reset = function() {
  delete this.point;
  delete this.soft;
  delete this.blackjack;
  delete this.busted;
};

/** Push and pop will reset previously calculated properties. */
Hand.prototype.push = function(card) {
  this._reset();
  this.cards.push(card);
};

Hand.prototype.take = function() {
  this._reset();
  return this.cards.pop();
};

Hand.prototype.toString = function() {
  return this.cards.map(function(card) {
    return card.suit + card.name;
  }).join(', ');
};

Object.defineProperty(Hand.prototype, 'name', {
  enumerable: true,
  configurable: true,
  get: function() {
    if (this.blackjack) return 'Blackjack';
    else if (this.busted) return 'Busted';
    else return this.soft ? 'Soft ' + this.point : '' + this.point;
  }
});

module.exports = Hand;
