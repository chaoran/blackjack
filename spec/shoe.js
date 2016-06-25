"use strict";

var Shoe = require('../shoe');

describe("Shoe", function() {
  describe("When initialized with options.nOfDecks > 0", function() {
    var testNumOfDecks = 4;

    beforeEach(function() {
      this.shoe = new Shoe({ nOfDecks: testNumOfDecks });
    });

    it("should contain the specified number of deck", function() {
      expect(this.shoe.total()).toBe(52 * testNumOfDecks);
    });
  });

  describe("When initialized with options.penetration > 0", function() {
    var options = { nOfDecks: 1, penetration: 0.1 };
    var shoe;

    beforeAll(function() {
      shoe = new Shoe(options);
    });

    describe("before reaching penetration depth", function() {
      it("should not shuffle", function() {
        var total = shoe.total();
        var nDraws = Math.floor(options.penetration * total);

        for (var i = 0; i < nDraws; ++i) {
          shoe.draw();
        }

        expect(shoe.left()).toBe(total - nDraws);
      });
    });

    describe("when reaching penetration depth", function() {
      describe("if shuffle is not called", function() {
        it("should not shuffle", function() {
          var left = shoe.left();
          shoe.draw();
          expect(shoe.left()).not.toBe(shoe.total() - 1);
          expect(shoe.left()).toBe(left - 1);
        });
      });

      describe('if shuffle is called', function() {
        it("should shuffle", function() {
          shoe.shuffle();
          shoe.draw();
          expect(shoe.left()).toBe(shoe.total() - 1);
        });
      });
    });
  });
});
