"use strict";

var Blackjack = require('../blackjack');
var Bank = require('../bank');
var Wager = require('../wager');
var Shoe = require('../shoe');
var Dealer = require('../dealer');
const SUITS = require('../lib/suits');
var Card = require('../lib/cards').Card;
const errors = require('../errors');

describe('Blackjack', function() {
  describe('#play()', function() {
    var blackjack, dealerBank, playerBank, dealer, hand, wager;

    beforeEach(function(done) {
      var shoe = {
        draw: () => {
          var card = this.cards.next();
          return card.value;
        },
        shuffle: function() {}
      };

      [ dealer, dealerBank, playerBank ] = [
        new Dealer(shoe),
        new Bank(),
        new Bank()
      ];

      blackjack = new Blackjack(dealerBank, dealer);

      playerBank.deposit(20, function(err) {
        expect(err).toBeFalsy();
        Wager.create(playerBank, 10, (err, _wager) => {
          expect(err).toBeFalsy();
          wager = _wager;
          done();
        });
      });
    });

    describe('if player is blackjack and dealer is not', function() {
      beforeEach(function() {
        this.cards = [
          new Card(SUITS.CLUBS, 'A'),
          new Card(SUITS.HEARTS, '10'),
          new Card(SUITS.DIAMONDS, 'J'),
          new Card(SUITS.SPADES, '2')
        ][Symbol.iterator]();

        hand = blackjack.play(wager);
      });

      it('should not emit "next" but "win"', function(done) {
        hand.on('next', function() {
          done.fail('emitted "next"');
        });
        hand.on('win', done);
      });
    });

    describe('player has "2" and "8"', function() {
      beforeEach(function() {
        this.cards = [
          new Card(SUITS.CLUBS, '2'),
          new Card(SUITS.HEARTS, '10'),
          new Card(SUITS.DIAMONDS, '8'),
          new Card(SUITS.SPADES, '7'),
          new Card(SUITS.CLUBS, '6'),
          new Card(SUITS.DIAMONDS, 'J')
        ][Symbol.iterator]();

        hand = blackjack.play(wager);
      });

      it('should present "hit, stand, double" as actions', function(done) {
        hand.once('next', function(dealerHand, actions) {
          expect(dealerHand).toBe(dealer.hand);
          expect(this.cards.length).toBe(2);
          expect(actions.hit).toBeDefined();
          expect(actions.stand).toBeDefined();
          expect(actions.double).toBeDefined();
          expect(actions.split).not.toBeDefined();
          done();
        });
      });

      describe('if player choose "hit"', function() {
        beforeEach(function(done) {
          hand.once('next', function(dealerHand, actions) {
            actions.hit();
            done();
          });
        });

        it('should present "hit, stand" as actions', function(done) {
          hand.once('next', function(dealerHand, actions) {
            expect(dealerHand).toBe(dealer.hand);
            expect(this.cards.length).toBe(3);
            expect(this.point).toBe(16);
            expect(actions.hit).toBeDefined();
            expect(actions.stand).toBeDefined();
            expect(actions.double).not.toBeDefined();
            expect(actions.split).not.toBeDefined();
            done();
          });
        });

        describe('if player "hit" again', function() {
          beforeEach(function(done) {
            hand.once('next', function(dealerHand, actions) {
              actions.hit();
              done();
            });
          });

          it('should not emit "next" but "lose"', function(done) {
            hand.once('next', function() {
              done.fail('emitted "next"');
            });
            hand.once('lose', function() {
              expect(this.busted).toBe(true);
              done();
            });
          });
        });
      });

      describe('if player choose "double"', function() {
        beforeEach(function(done) {
          hand.once('next', function(dealerHand, actions) {
            actions.double();
            done();
          });
        });

        it('should not emit "next" but "lose"', function(done) {
          hand.once('next', function() {
            done.fail('emitted "next"');
          });
          hand.once('lose', function() {
            expect(hand.cards.length).toBe(3);
            done();
          });
        });
      });
    });

    describe('if player has "8" and "8"', function() {
      beforeEach(function(done) {
        this.cards = [
          new Card(SUITS.CLUBS, '8'), // player 1 = 8
          new Card(SUITS.HEARTS, '10'), // dealer = 10
          new Card(SUITS.DIAMONDS, '8'), // player 2 = 8
          new Card(SUITS.SPADES, '6'), // dealer = 16
          new Card(SUITS.CLUBS, 'J'), // player 1 = 18
          new Card(SUITS.DIAMONDS, '8'), // player 2 = 16
          new Card(SUITS.DIAMONDS, '6'), // player 2 = 22
          new Card(SUITS.DIAMONDS, 'Q') // dealer = 26
        ][Symbol.iterator]();

        hand = blackjack.play(wager);

        dealerBank.deposit(20, function(err) {
          expect(err).toBeFalsy();
          done();
        });
      });

      it('should present all actions', function(done) {
        hand.once('next', function(dealerHand, actions) {
          expect(dealerHand).toBe(dealer.hand);
          expect(this.cards.length).toBe(2);
          expect(this.point).toBe(16);
          expect(actions.hit).toBeDefined();
          expect(actions.stand).toBeDefined();
          expect(actions.double).toBeDefined();
          expect(actions.split).toBeDefined();
          done();
        });
      });

      describe('if it splits', function() {
        var hand2, wager2;

        beforeEach(function(done) {
          hand.once('next', function(dealerHand, actions) {
            wager.split(function(err, newWager) {
              expect(err).toBeFalsy();
              hand2 = actions.split(newWager);
              wager2 = newWager;
              done();
            });
          });
        });

        it('should play original hand first', function(done) {
          hand.once('next', function() {
            expect(hand.point).toBe(18);
            done();
          });
        });

        describe('player stands the first hand', function() {
          beforeEach(function(done) {
            hand.once('next', function(dealerHand, actions) {
              expect(actions.split).not.toBeDefined();
              expect(this.point).toBe(18);
              actions.stand();
              done();
            });
          });

          it('should play second hand if player stands', function(done) {
            hand.once('next', function() {
              done.fail('emitted "next" on a stand hand');
            });
            hand2.once('next', done);
          });

          describe('if player hit the second hand', function() {
            beforeEach(function(done) {
              hand2.once('next', function(dealerHand, actions) {
                expect(this.point).toBe(16);
                expect(actions.hit).toBeDefined();
                actions.hit();
                done();
              });
            });

            it('the first hand should emit "win"', function(done) {
              hand.once('win', function(dealerHand) {
                expect(dealerHand.busted).toBe(true);
                expect(this.point).toBe(18);
                done();
              });
            });

            it('the second hand should emit "push"', function(done) {
              hand2.once('push', function(dealerHand) {
                expect(dealerHand.busted).toBe(true);
                expect(this.busted).toBe(true);
                done();
              });
            });

            it('should claim 30 from first hand', function(done) {
              blackjack.once('end', function() {
                playerBank.inquire(function(err, balance) {
                  expect(err).toBeFalsy();
                  expect(balance).toBe(30);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});
