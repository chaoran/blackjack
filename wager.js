"use strict";

var errors = require('./errors').wager;

function Wager(bank, amount) {
  this.split = function(done) {
    Wager.create(bank, amount, done);
  };

  this.double = function(dry, done) {
    if (arguments.length === 1) {
      done = dry;
      dry = false;
    }

    if (dry) {
      bank.inquire(function(err, balance) {
        done(err, balance >= amount);
      });
    } else {
      bank.withdraw(amount, function(err) {
        if (!err) amount += amount;
        done(err);
      });
    }
  };

  this.pay = (...args) => {
    switch (args.length) {
      case 1: {
        let [ done ] = args;
        this.pay(bank, done);
        break;
      }
      case 2: {
        let [ dest, done ] = args;
        dest.deposit(amount, function(err) {
          if (!err) amount = 0;
          done(err);
        });
        break;
      }
      case 3: {
        let [ rate, src, done ] = args;
        src.withdraw(rate * amount, (err) => {
          if (err) return done(err);
          amount += rate * amount;
          this.pay(bank, done);
        });
        break;
      }
      default:
        throw new Error("expects 1-3 arguments but receives " +
                        args.length);
    }
  };
}

Wager.create = function(bank, amount, done) {
  bank.withdraw(amount, function(err) {
    var wager = !err ? new Wager(bank, amount) : null;
    done(err, wager);
  });
};

module.exports = Wager;
