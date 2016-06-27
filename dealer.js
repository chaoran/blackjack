"use strict";

function Dealer(shoe, options) {
  this._shoe = shoe;
  this._hit17 = options && options.hit17 || false;
}

Dealer.prototype.deal = function(dealerHand, playerHand) {
  this._shoe.shuffle();
  this.hand = dealerHand;

  playerHand.push(this._shoe.draw());
  dealerHand.push(this._shoe.draw());
  playerHand.push(this._shoe.draw());
  dealerHand.hide(this._shoe.draw());
};

Dealer.prototype.serve = function(...hands) {
  for (let hand of hands)
    hand.push(this._shoe.draw());
};

Dealer.prototype.show = function(hands) {
  this.hand.reveal();

  for (let hand of hands) {
    if (hand.busted) {
      hand.emit(this.hand.busted ? 'push' : 'lose', this.hand);
      continue;
    }

    if (hand.blackjack) {
      hand.emit(this.hand.blackjack ? 'push' : 'win', this.hand);
      continue;
    }

    while (this.hand.point < 17 ||
           this._hit17 && this.hand.soft && this.hand.point === 17) {
      this.hand.push(this._shoe.draw());
    }

    if (this.hand.busted || hand.point > this.hand.point) {
      hand.emit('win', this.hand);
    } else if (hand.point === this.hand.point) {
      hand.emit('push', this.hand);
    } else if (hand.point < this.hand.point) {
      hand.emit('lose', this.hand);
    }
  }
};

module.exports = Dealer;
