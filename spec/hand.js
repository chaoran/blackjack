"use strict";

var Hand = require('../hand');
var Card = require('../lib/cards').Card;
var SUITS = require('../lib/suits');

describe("Hand", function() {
  var cardA = new Card(SUITS.SPADES, 'A');
  var card2 = new Card(SUITS.HEARTS, '2');

  beforeEach(function() {
    this.hand = new Hand();
  });

  describe("After adding an 'A' and a '2' into a hand", function() {
    beforeEach(function() {
      this.hand.add(cardA);
      this.hand.add(card2);
    });

    it("has 'A' at position '0' and '2' at position '1'", function() {
      expect(this.hand[0]).toBe(cardA);
      expect(this.hand[1]).toBe(card2);
    });

    it("has length 2", function() {
      expect(this.hand.length).toBe(2);
    });

    it("has 13 points", function() {
      expect(this.hand.points).toBe(13);
    });

    it("can tell whether a hand is soft", function() {
      expect(this.hand.isSoft()).toBe(true);
    });

    it("stringifies to 'Soft 13'", function() {
      expect(this.hand.toString()).toBe('Soft 13');
    });

    describe("After adding a '10' to a 'soft 13'", function() {
      beforeEach(function() {
        var card = new Card(SUITS.DIAMONDS, '10');
        this.hand.add(card);
      });

      it('has length 3', function() {
        expect(this.hand.length).toBe(3);
      });

      it("becomes a 'hard 13'", function() {
        expect(this.hand.points).toBe(13);
        expect(this.hand.isSoft()).toBe(false);
      });

      it('stringifies to "13"', function() {
        expect(this.hand.toString()).toBe('13');
      });

      describe("After adding another 'A' to a hard '13'", function() {
        beforeEach(function() {
          var card = new Card(SUITS.CLUBS, 'A');
          this.hand.add(card);
        });

        it("is a 'hard 14'", function() {
          expect(this.hand.points).toBe(14);
          expect(this.hand.isSoft()).toBe(false);
        });
      });
    });
  });
});