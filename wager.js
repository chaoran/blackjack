"use strict";

var errors = require('./errors').wager;

function Wager(bank, amount) {
  this.split = function(done) {
    Wager.create(bank, amount, done);
  };

  this.double = function(source, done) {
    if (arguments.length === 1) {
      done = source;
      source = bank;
    }

    source.withdraw(amount, function(err) {
      if (!err) amount += amount;
      done(err);
    });
  };

  this.claim = function(dest, done) {
    if (arguments.length === 1) {
      done = dest;
      dest = bank;
    }

    if (amount === 0) return done(errors.AC);

    dest.deposit(amount, function(err) {
      if (!err) amount = 0;
      done(err);
    });
  };
}

Wager.create = function(bank, amount, done) {
  bank.withdraw(amount, function(err) {
    var wager = !err ? new Wager(bank, amount) : null;
    done(err, wager);
  });
};

module.exports = Wager;
