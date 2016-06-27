"use strict";
var Hand = require('./hand');
var EventEmitter = require('events');

function Blackjack(bank, dealer, options) {
  EventEmitter.call(this);

  options = options || {};
  this._dealer = dealer;

  var nHands = 0;
  this._createHand = (wager) => {
    nHands++;

    var hand = new Hand();
    var done = () => {
      if (--nHands === 0) process.nextTick(() => {
        this.emit('end');
      });
    };

    hand.once('win', () => {
      var rate = hand.blackjack ? options.blackjackPay || 1.5 : 1;
      wager.pay(rate, bank, done);
    });

    hand.once('lose', () => {
      wager.pay(bank, done);
    });

    hand.once('push', () => {
      wager.pay(done);
    });

    return hand;
  };

  this._allowDouble = options.allowDouble || true;
  this._allowSplit = options.allowSplit || true;
}

Blackjack.prototype = Object.create(EventEmitter.prototype, {
  constructor: Blackjack
});

Blackjack.prototype.play = function(wager) {
  var dealerHand = new Hand();
  var playerHand = this._createHand(wager);

  this._queue = [];
  this._stand = [];

  this._dealer.deal(dealerHand, playerHand);

  process.nextTick(() => { this._next(playerHand); });
  return playerHand;
};

Blackjack.prototype._next = function(hand) {
  if (!hand) hand = this._queue.pop();

  if (!hand) return process.nextTick(() => {
    this._dealer.show(this._stand);
  });

  if (hand.point >= 21) {
    this._stand.push(hand);
    return this._next();
  }

  var actions = Object.create(null);

  actions.stand = () => {
    this._stand.push(hand);
    this._next();
  };

  actions.hit = () => {
    this._dealer.serve(hand);
    this._next(hand);
  };

  if (hand.cards.length === 2) {
    if (this._allowDouble === true ||
        this._allowDouble[hand.point] === true) {
      actions.double = () => {
        this._dealer.serve(hand);
        this._stand.push(hand);
        this._next();
      };
    }

    if (hand.cards[0].name === hand.cards[1].name &&
        (this._allowSplit === true ||
         this._allowSplit[hand.point] === true)) {
      actions.split = (wager) => {
        var oldHand = hand;
        var newHand = this._createHand(wager);

        newHand.push(hand.take());
        this._dealer.serve(oldHand, newHand);

        this._queue.push(newHand);
        this._next(oldHand);

        return newHand;
      };
    }
  }

  process.nextTick(() => {
    hand.emit('next', this._dealer.hand, actions);
  });
};

module.exports = Blackjack;
