"use strict";

function Wager(bank, amount) {
  this.split = function(done) {
    Wager.create(bank, amount, done);
  };

  this.double = function(done) {
    bank.withdraw(amount, function(err) {
      if (!err) amount += amount;
      done(err);
    });
  };

  this.claim = function(bank, done) {
    bank.deposit(amount, function(err) {
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
