"use strict";

var Dealer = require('../dealer');

describe('Dealer', () => {
  var dealer, shoe, dealerHand, playerHand;

  beforeEach(() => {
    shoe = jasmine.createSpyObj('shoe', [ 'shuffle', 'draw' ]);
    dealerHand = jasmine.createSpyObj('dealerHand', [ 'push', 'hide' ]);
    playerHand = jasmine.createSpyObj('playerHand', [ 'push' ]);
    dealer = new Dealer(shoe);
  });

  describe('#deal()', () => {
    var hand;

    beforeEach(() => {
      spyOn(dealer, 'show');
      hand = dealer.deal(dealerHand, playerHand);
    });

    it('shuffles the shoe', () => {
      expect(shoe.shuffle).toHaveBeenCalled();
    });

    it('deals two cards to the player', () => {
      expect(playerHand.push).toHaveBeenCalledTimes(2);
    });

    it('deals two cards to the dealer, one of them is hidden', () => {
      expect(dealerHand.push).toHaveBeenCalledTimes(1);
      expect(dealerHand.hide).toHaveBeenCalledTimes(1);
    });

    it('does not call #show() if playerHand is not blackjack', () => {
      expect(dealer.show).not.toHaveBeenCalledWith(playerHand);
      expect(hand).toBe(playerHand);
    });

    it('calls #show() if playerHand is blackjack', () => {
      playerHand.blackjack = true;
      var hand = dealer.deal(dealerHand, playerHand);
      expect(dealer.show).toHaveBeenCalledWith(playerHand);
      expect(hand).toBe(null);
    });
  });

  describe('#serve()', () => {
    var hand1, hand2;

    beforeEach(function() {
      var push = function() { this.point += 1; };

      hand1 = { point: 20, push };
      hand2 = { point: 19, push };

      spyOn(hand1, 'push').and.callThrough();
      spyOn(hand2, 'push').and.callThrough();
      spyOn(dealer, 'show');
    });

    it('should deal one card to each hand', function() {
      dealer.serve(hand1, hand2);
      expect(hand1.push).toHaveBeenCalledTimes(1);
      expect(hand2.push).toHaveBeenCalledTimes(1);
    });

    it('should not return a hand that has >= 21 point', function() {
      var [ newHand1, newHand2 ] = dealer.serve(hand1, hand2);
      expect(newHand1).toBeFalsy();
      expect(newHand2).toBe(hand2);
    });

    it('should call #show() on hands that have >= 21 point', function() {
      dealer.serve(hand1, hand2);
      expect(dealer.show).toHaveBeenCalledTimes(1);
      expect(dealer.show).toHaveBeenCalledWith(hand1);
    });
  });

  describe('#show()', () => {
    let hand;

    beforeEach(() => {
      hand = {
        emit: jasmine.createSpy('emit')
      };

      dealer.hand = {
        point: 15,
        push: function() { this.point += 1; },
        reveal: function() { this.point = 18; },
      };

      spyOn(dealer.hand, 'reveal');
    });

    it("should call reveal on dealer's hand", () => {
      dealer.show(hand);
      expect(dealer.hand.reveal).toHaveBeenCalledTimes(1);
    });

    it('should emit "win" if player is blackjack and dealer is not', () => {
      hand.blackjack = true;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('win');
    });

    it('should emit "push" if both player and dealer has blackjack', () => {
      hand.blackjack = true;
      dealer.hand.blackjack = true;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('push');
    });

    it('should emit "lose" if player is busted', () => {
      hand.busted = true;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('lose');
    });

    it('should keep drawing the dealerHand until it reaches 18', () => {
      dealer.show(hand);
      expect(dealer.hand.point).toBe(17);
    });

    it('should emit "win" if player has more point', () => {
      hand.point = 20;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('win');
    });

    it('should emit "lose" if player has less point', () => {
      hand.point = 16;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('lose');
    });

    it('should emit "push" if player has less point', () => {
      hand.point = 17;
      dealer.show(hand);
      expect(hand.emit).toHaveBeenCalledWith('push');
    });
  });
});

