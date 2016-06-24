"use strict";

var errors = require('./errors').bank;

function Bank() {
  var balance = 0;

  this.deposit = function(amount, done) {
    if (balance > Number.MAX_SAFE_INTEGER - amount)
      return process.nextTick(done, errors.BO);

    balance += amount;
    process.nextTick(done);
  };

  this.withdraw = function(amount, done) {
    if (balance < amount)
      return process.nextTick(done, errors.IF);

    balance -= amount;
    process.nextTick(done);
  };

  this.inquire = function(done) {
    process.nextTick(done, null, balance);
  };
}

module.exports = Bank;
