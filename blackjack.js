"use strict";
var Hand = require('./hand');

function Blackjack(bank, dealer, options) {
  this._dealer = dealer;
  this._createHand = (wager) => {
    var hand = new Hand();
    var done = function() { hand.emit('end'); };

    hand.once('win', () => { wager.double(bank, done); });
    hand.once('lose', () => { wager.claim(bank, done); });
    hand.once('push', done);

    return hand;
  };

  this._queue = [];
  this._stand = [];

  options = options || {};
  this._allowDouble = options.allowDouble || true;
  this._allowSplit = options.allowSplit || true;
}

Blackjack.prototype.play = function(wager) {
  var dealerHand = new Hand();
  var playerHand = this._createHand(wager);

  this._dealer.deal(dealerHand, playerHand);

  process.nextTick(() => { this._next(playerHand); });
  return playerHand;
};

Blackjack.prototype._next = function(hand) {
  if (!hand) hand = this._queue.pop();

  if (!hand) return process.nextTick(() => {
    this._dealer.show(this._stand);
  });

  if (hand.busted || hand.blackjack) {
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
