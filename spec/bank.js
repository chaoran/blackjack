"use strict";

var Bank = require('../bank');
var errors = require('../errors').bank;

describe("Bank", function() {
  var bank;

  beforeEach(function() {
    bank = new Bank();
  });

  describe("#inquire()", function() {
    it("should return 0 initially", function(done) {
      bank.inquire(function(err, balance) {
        expect(err).toBeFalsy();
        expect(balance).toBe(0);
        done();
      });
    });
  });

  describe("#deposit()", function() {
    describe("#deposit(10)", function() {
      it("should add 10 to the bank's balance", function(done) {
        bank.deposit(10, function(err) {
          expect(err).toBeFalsy();

          bank.inquire(function(err, balance) {
            expect(err).toBeFalsy();
            expect(balance).toBe(10);
            done();
          });
        });
      });

      describe("if deposit may overflow the balance", function() {
        var bignum = Number.MAX_SAFE_INTEGER - 9;

        beforeEach(function(done) {
          bank.deposit(bignum, function(err) {
            expect(err).toBeFalsy();
            done();
          });
        });

        it("should return errors.BO", function(done) {
          bank.deposit(10, function(err) {
            expect(err).toBe(errors.BO);

            bank.inquire(function(err, balance) {
              expect(err).toBeFalsy();
              expect(balance).toBe(bignum);
              done();
            });
          });
        });
      });
    });
  });

  describe("#withdraw()", function() {
    describe("#withdraw(10)", function() {
      describe("when balance is less than 10", function() {
        it("should return errors.IF", function(done) {
          bank.withdraw(10, function(err) {
            expect(err).toBe(errors.IF);

            bank.inquire(function(err, balance) {
              expect(err).toBeFalsy();
              expect(balance).toBe(0);
              done();
            });
          });
        });
      });

      describe("when balance is more than 10", function() {
        var prevBalance = 11;

        beforeEach(function(done) {
          bank.deposit(prevBalance, done);
        });

        it("should decrement balance by 10", function(done) {
          bank.withdraw(10, function(err) {
            expect(err).toBeFalsy();

            bank.inquire(function(err, balance) {
              expect(err).toBeFalsy();
              expect(balance).toBe(1);
              done();
            });
          });
        });
      });
    });
  });
});
