"use strict";

var colors = require('../colors');
var suits = require('../suits');

describe("Suits", function() {
  it("has 'Hearts'", function() {
    var hearts = suits.HEARTS;

    expect(hearts).toEqual(jasmine.anything());
    expect(hearts.toString()).toBe("Hearts");
    expect(hearts.color).toBe(colors.RED);
  });

  it("has 'Diamonds'", function() {
    var diamonds = suits.DIAMONDS;

    expect(diamonds).toEqual(jasmine.anything());
    expect(diamonds.toString()).toBe("Diamonds");
    expect(diamonds.color).toBe(colors.RED);
  });

  it("has 'Clubs'", function() {
    var clubs = suits.CLUBS;

    expect(clubs).toEqual(jasmine.anything());
    expect(clubs.toString()).toBe("Clubs");
    expect(clubs.color).toBe(colors.BLACK);
  });

  it("has 'Spades'", function() {
    var spades = suits.SPADES;

    expect(spades).toEqual(jasmine.anything());
    expect(spades.toString()).toBe("Spades");
    expect(spades.color).toBe(colors.BLACK);
  });
});
