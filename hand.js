"use strict";

function Hand() {
  this.points = 0;
  this._nAces = 0;
}

Hand.prototype = Object.create(Array.prototype);

Hand.prototype.add = function(card) {
  this.push(card);

  switch (card.name) {
    case 'A': {
      this.points += 11;
      this._nAces += 1; break;
    }
    case '2': this.points += 2; break;
    case '3': this.points += 3; break;
    case '4': this.points += 4; break;
    case '5': this.points += 5; break;
    case '6': this.points += 6; break;
    case '7': this.points += 7; break;
    case '8': this.points += 8; break;
    case '9': this.points += 9; break;
    case '10': this.points += 10; break;
    case 'J': this.points += 10; break;
    case 'Q': this.points += 10; break;
    case 'K': this.points += 10; break;
    default:
      throw new Error("Unknown card: " + card);
  }

  while (this.points > 21 && this._nAces-- > 0)
    this.points -= 10;
};

Hand.prototype.isSoft = function() {
  return (this._nAces > 0);
};

Hand.prototype.toString = function() {
  var str = this.points.toString();

  if (this.isSoft()) str = 'Soft ' + str;

  return str;
};

module.exports = Hand;
