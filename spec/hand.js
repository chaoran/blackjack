"use strict";

var Hand = require('../hand');
var Card = require('../lib/cards').Card;
var SUITS = require('../lib/suits');

describe("Hand", function() {
  var cardA = new Card(SUITS.SPADES, 'A');
  var card2 = new Card(SUITS.HEARTS, '2');
  var card8 = new Card(SUITS.DIAMONDS, '8');
  var cardJ = new Card(SUITS.CLUBS, 'J');

  beforeEach(function() {
    this.hand = new Hand();
  });

  describe("After adding an 'A' and a '2' into a hand", function() {
    beforeEach(function() {
      this.hand.push(cardA);
      this.hand.push(card2);
    });

    it("has 'A' at position '0' and '2' at position '1'", function() {
      expect(this.hand.cards[0]).toBe(cardA);
      expect(this.hand.cards[1]).toBe(card2);
    });

    it("has length 2", function() {
      expect(this.hand.cards.length).toBe(2);
    });

    it("has 13 points", function() {
      expect(this.hand.point).toBe(13);
    });

    it("can tell whether a hand is soft", function() {
      expect(this.hand.soft).toBe(true);
    });

    it("stringifies to 'Soft 13'", function() {
      expect(this.hand.toString()).toBe('Soft 13');
    });

    describe("After adding a 'J' to a 'soft 13'", function() {
      beforeEach(function() {
        this.hand.push(cardJ);
      });

      it('has length 3', function() {
        expect(this.hand.cards.length).toBe(3);
      });

      it("becomes a 'hard 13'", function() {
        expect(this.hand.point).toBe(13);
        expect(this.hand.soft).toBe(false);
      });

      it('stringifies to "13"', function() {
        expect(this.hand.toString()).toBe('13');
      });

      describe("After adding another 'A' to a hard '13'", function() {
        it("is a 'hard 14'", function() {
          expect(this.hand.point).toBe(13);
          this.hand.push(cardA);
          expect(this.hand.point).toBe(14);
          expect(this.hand.soft).toBe(false);
        });
      });

      describe('After adding a "J" to a hard "13"', function() {
        it('is busted', function() {
          expect(this.hand.busted).toBe(false);
          this.hand.push(cardJ);
          expect(this.hand.busted).toBe(true);
        });
      });
    });

    describe("After adding a '8' to a 'soft 13'", function() {
      beforeEach(function() {
        this.hand.push(card8);
      });

      it('is not a Blackjack', function() {
        expect(this.hand.blackjack).toBe(false);
      });

      it('stringifies to "Soft 21"', function() {
        expect(this.hand.toString()).toBe('Soft 21');
      });
    });
  });

  describe('After adding an "A" and a "J"', function() {
    beforeEach(function() {
      this.hand.push(cardA);
      this.hand.push(cardJ);
    });

    it('has 21 points', function() {
      expect(this.hand.point).toBe(21);
    });

    it('is a Blackjack', function() {
      expect(this.hand.blackjack).toBe(true);
    });

    it('stringifies to Blackjack', function() {
      expect(this.hand.toString()).toBe('Blackjack');
    });
  });

  describe("When dealt a hidden card", function() {
    beforeEach(function() {
      this.hand.push(cardJ);
      this.hand.hide(cardA);
    });

    it('has only one card visiable', function() {
      expect(this.hand.cards.length).toBe(1);
    });

    it('does not count the hidden card when calculating point', function() {
      expect(this.hand.point).toBe(10);
    });

    describe('After hidden card is revealed', function() {
      beforeEach(function() {
        this.hand.reveal();
      });

      it('has two cards visiable', function() {
        expect(this.hand.cards.length).toBe(2);
        expect(this.hand.cards[1]).toBe(cardA);
      });

      it('counts the hidden card when calculating point', function() {
        expect(this.hand.point).toBe(21);
      });
    });
  });
});
