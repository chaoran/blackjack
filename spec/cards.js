"use strict";

var suits = require('../suits');
var cards = require('../cards');
var names = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
];
var suits = [
  'Hearts', 'Diamonds', 'Clubs', 'Spades'
];

describe("Cards", function() {
  var Card;
  var table;

  beforeAll(function() {
    Card = cards[0].constructor;
    table = Object.create(null);

    cards.forEach(function(card) {
      if (table[card.name] === undefined) {
        table[card.name] = Object.create(null);
      }

      table[card.name][card.suit] = card;
    });
  });

  it("has 54 standard cards", function() {
    expect(cards.length).toBe(54);
  });

  it("has 'A' to 'K' cards in four suits", function() {
    names.forEach(function(name) {
      expect(table[name]).toEqual(jasmine.anything());

      suits.forEach(function(suit) {
        expect(table[name][suit]).toEqual(jasmine.any(Card));
        expect(table[name][suit].toString()).toBe(name + ' ' + suit);
      });
    });
  });

  it("has 'Jokers' in two colors", function() {
    expect(table.Joker.Red).toEqual(jasmine.any(Card));
    expect(table.Joker.Red.toString()).toBe("Joker Red");
    expect(table.Joker.Black).toEqual(jasmine.any(Card));
    expect(table.Joker.Black.toString()).toBe("Joker Black");
  });
});

