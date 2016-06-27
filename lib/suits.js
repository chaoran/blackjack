"use strict";
/*jshint -W053 */

const colors = require('./colors');
const suits = {
  RED: new String('Red'),
  HEARTS: new String('Hearts'),
  DIAMONDS: new String('Diamonds'),

  BLACK: new String('Black'),
  CLUBS: new String('Clubs'),
  SPADES: new String('Spades')
};

suits.RED.color = colors.RED;
suits.HEARTS.color = colors.RED;
suits.DIAMONDS.color = colors.RED;

suits.BLACK.color = colors.BLACK;
suits.CLUBS.color = colors.BLACK;
suits.SPADES.color = colors.BLACK;

module.exports = suits;
