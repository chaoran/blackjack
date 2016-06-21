"use strict";

var Shoe = require('../Shoe');

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
      it("should shuffle", function() {
        shoe.draw();
        expect(shoe.left()).toBe(shoe.total() - 1);
      });
    });
  });
});
