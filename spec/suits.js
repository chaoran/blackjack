"use strict";

var colors = require('../lib/colors');
var suits = require('../lib/suits');

describe("Suits", function() {
  it("has 'Hearts'", function() {
    var hearts = suits.HEARTS;

    expect(hearts).toEqual(jasmine.anything());
    expect(hearts.toString()).toBe("\u2665");
    expect(hearts.color).toBe(colors.RED);
  });

  it("has 'Diamonds'", function() {
    var diamonds = suits.DIAMONDS;

    expect(diamonds).toEqual(jasmine.anything());
    expect(diamonds.toString()).toBe("\u2666");
    expect(diamonds.color).toBe(colors.RED);
  });

  it("has 'Clubs'", function() {
    var clubs = suits.CLUBS;

    expect(clubs).toEqual(jasmine.anything());
    expect(clubs.toString()).toBe("\u2663");
    expect(clubs.color).toBe(colors.BLACK);
  });

  it("has 'Spades'", function() {
    var spades = suits.SPADES;

    expect(spades).toEqual(jasmine.anything());
    expect(spades.toString()).toBe("\u2660");
    expect(spades.color).toBe(colors.BLACK);
  });
});
