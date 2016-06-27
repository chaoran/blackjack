"use strict";
/*jshint -W053 */

const colors = require('./colors');
const suits = {
  RED: new String('Red'),
  HEARTS: new String("\u2665"),
  DIAMONDS: new String("\u2666"),

  BLACK: new String('Black'),
  CLUBS: new String("\u2663"),
  SPADES: new String("\u2660")
};

suits.RED.color = colors.RED;
suits.HEARTS.color = colors.RED;
suits.DIAMONDS.color = colors.RED;

suits.BLACK.color = colors.BLACK;
suits.CLUBS.color = colors.BLACK;
suits.SPADES.color = colors.BLACK;

module.exports = suits;
