"use strict";
var Wager = require('./wager');
var errors = require('./errors');
var EventEmitter = require('events');

function Player(bank) {
  EventEmitter.call(this);
  this._bank = bank;
}

Player.prototype = Object.create(EventEmitter.prototype, {
  constructor: Player
});

Player.prototype.play = function(game, bet, done) {
  Wager.create(this._bank, bet, (err, wager) => {
    if (err) return this.emit('error', err);

    var hand = game.play(wager);
    this._capture(hand, wager);
  });
};

Player.prototype._capture = function(hand, wager) {
  hand.on('next', (dealerHand, actions) => {
    this._next({ hand, dealerHand, actions, wager });
  });

  hand.once('win', (dealerHand) => {
    this.emit('win', hand, dealerHand);
  });

  hand.once('push', (dealerHand) => {
    this.emit('push', hand, dealerHand);
  });

  hand.once('lose', (dealerHand) => {
    this.emit('lose', hand, dealerHand);
  });
};

Player.prototype._split = function(wager, split) {
  wager.split((err, wager) => {
    if (err) return this._err(err);
    this._capture(split(wager), wager);
  });
};

Player.prototype._double = function(wager, double) {
  wager.double((err) => {
    if (err) this._err(err);
    else double();
  });
};

Player.prototype._next = function(state) {
  var { hand, dealerHand, actions, wager } = state;

  if (!actions.split && !actions.double)
    return this.emit('next', hand, dealerHand, actions);

  wager.double(true, (err, enough) => {
    if (err) return this.emit('error', err);

    if (!enough) {
      delete actions.split;
      delete actions.double;
    } else {
      if (actions.split) {
        var split = actions.split;
        actions.split = () => { this._split(wager, split); };
      }

      if (actions.double) {
        var double = actions.double;
        actions.double = () => { this._double(wager, double); };
      }
    }

    this.emit('next', hand, dealerHand, actions);
  });
};

module.exports = Player;
