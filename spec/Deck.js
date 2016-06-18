"use strict";

var Deck = require('../lib/Deck');
var cards = require('../lib/cards');
var Card = cards.Card;

describe("A deck", function() {
  beforeEach(function() {
    this.deck = new Deck(cards.slice());
  });

  describe("Initially", function() {
    it("contains all the cards it is constructed with", function() {
      expect(this.deck.total()).toBe(54);
    });

    it("has all the cards left to draw", function() {
      expect(this.deck.left()).toBe(54);
    });
  });

  describe("When drawing", function() {
    it("draws a card", function() {
      var card = this.deck.draw();
      expect(card).toEqual(jasmine.any(Card));
    });
  });

  describe("After drawing a card", function() {
    beforeEach(function() {
      this.drawn = this.deck.draw();
    });

    it("has one less card left to draw", function() {
      expect(this.deck.left()).toBe(this.deck.total() - 1);
    });

    it("won't draw the same card again", function() {
      for (var i = 0; i < 53; ++i) {
        expect(this.deck.draw()).not.toBe(this.drawn);
      }
    });

    describe("After shuffling", function() {
      beforeEach(function() {
        this.deck.shuffle();
      });

      it("has all the cards left to draw", function() {
        expect(this.deck.left()).toEqual(this.deck.total());
      });
    });
  });
});
