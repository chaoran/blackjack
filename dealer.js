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

  if (playerHand.blackjack) {
    this.show(playerHand);
    return null;
  } else {
    return playerHand;
  }
};

Dealer.prototype.serve = function(...hands) {
  return hands.map((hand) => {
      hand.push(this._shoe.draw());
      return hand.point >= 21 ? this.show(hand) : hand;
  });
};

Dealer.prototype.show = function(hand) {
  this.hand.reveal();

  if (hand.busted) {
    hand.emit('lose');
    return;
  }

  if (hand.blackjack) {
    hand.emit(this.hand.blackjack ? 'push' : 'win');
    return;
  }

  while (this.hand.point < 17 ||
         this._hit17 && this.hand.soft && this.hand.point === 17) {
    this.hand.push(this._shoe.draw());
  }

  if (hand.point === this.hand.point) {
    hand.emit('push');
  } else if (hand.point < this.hand.point) {
    hand.emit('lose');
  } else {
    hand.emit('win');
  }
};

module.exports = Dealer;
