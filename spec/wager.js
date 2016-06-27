"use strict";

var Wager = require('../wager');
var Bank = require('../bank');
var errors = require('../errors');

describe('Wager', function() {
  var wager, bank;

  function createWager(bank, amount, done) {
    Wager.create(bank, amount, function(err, _wager) {
      wager = _wager;
      done();
    });
  }

  function checkBalance(bank, amount, done) {
    bank.inquire(function(err, balance) {
      expect(err).toBeFalsy();
      expect(balance).toBe(amount);
      done();
    });
  }

  function checkWager(wager, amount, done) {
    var emptyBank = new Bank();

    wager.claim(emptyBank, function(err) {
      expect(err).toBeFalsy();
      checkBalance(emptyBank, amount, done);
    });
  }

  beforeAll(function() {
    expect(errors.bank.IF).toBeTruthy();
  });

  beforeEach(function(done) {
    bank = new Bank();
    bank.deposit(10, done);
  });

  describe('.create()', function() {
    it('should create a wager if having enough funds', function(done) {
      Wager.create(bank, 10, function(err, wager) {
        expect(err).toBeFalsy();
        expect(wager).toEqual(jasmine.any(Wager));

        checkBalance(bank, 0, done);
      });
    });

    it('should emit an errors.bank.IF if not enough funds', function(done) {
      Wager.create(bank, 15, function(err, wager) {
        expect(err).toBe(errors.bank.IF);
        expect(wager).toBe(null);

        checkBalance(bank, 10, done);
      });
    });
  });

  describe('#claim()', function() {
    beforeEach(function(done) {
      createWager(bank, 5, done);
    });

    it('should deposit the wager into a bank', function(done) {
      checkBalance(bank, 5, function() {
        wager.claim(function(err) {
          expect(err).toBeFalsy();
          checkBalance(bank, 10, done);
        });
      });
    });

    describe('given a different bank', function() {
      var anotherBank;

      beforeEach(function() {
        anotherBank = new Bank();
      });

      it('should deposit into the different bank', function(done) {
        wager.claim(anotherBank, function(err) {
          expect(err).toBeFalsy();
          checkBalance(bank, 5, done);
        });
      });
    });

    describe('if claim again', function() {
      beforeEach(function(done) {
        wager.claim(done);
      });

      it('should emit errors.wager.AC', function(done) {
        wager.claim(function(err) {
          expect(err).toBeDefined();
          expect(err).toBe(errors.wager.AC);
          done();
        });
      });
    });
  });

  describe('#double()', function() {
    describe('when bank has enough funds', function() {
      beforeEach(function(done) {
        createWager(bank, 5, done);
      });

      it('should double the wager', function(done) {
        checkBalance(bank, 5, function() {
          wager.double(function(err) {
            expect(err).toBeFalsy();
            checkBalance(bank, 0, function() {
              checkWager(wager, 10, done);
            });
          });
        });
      });

      describe('when using a different bank', function() {
        var anotherBank;

        beforeEach(function(done) {
          anotherBank = new Bank();
          anotherBank.deposit(10, done);
        });

        it('should take money form the given bank', function(done) {
          wager.double(anotherBank, function(err) {
            expect(err).toBeFalsy();
            checkBalance(anotherBank, 5, function() {
              checkWager(wager, 10, done);
            });
          });
        });
      });
    });

    describe('when bank does not have enough funds', function() {
      beforeEach(function(done) {
        createWager(bank, 6, done);
      });

      it('should emit errors.bank.IF', function(done) {
        checkBalance(bank, 4, function() {
          wager.double(function(err) {
            expect(err).toBe(errors.bank.IF);
            checkBalance(bank, 4, function() {
              checkWager(wager, 6, done);
            });
          });
        });
      });
    });
  });

  describe('#split()', function() {
    describe('when bank has enough funds', function() {
      beforeEach(function(done) {
        createWager(bank, 5, done);
      });

      it('should split a new wager', function(done) {
        checkBalance(bank, 5, function() {
          wager.split(function(err, newWager) {
            expect(err).toBeFalsy();
            checkBalance(bank, 0, function() {
              checkWager(newWager, 5, done);
            });
          });
        });
      });
    });

    describe('when bank does not have enough funds', function() {
      beforeEach(function(done) {
        createWager(bank, 6, done);
      });

      it('should emit errors.bank.IF', function(done) {
        checkBalance(bank, 4, function() {
          wager.split(function(err, newWager) {
            expect(err).toBe(errors.bank.IF);
            expect(newWager).toBe(null);
            checkBalance(bank, 4, done);
          });
        });
      });
    });
  });
});
