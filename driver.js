"use strict";
const [ readline, Player, Bank, Dealer, Shoe, Blackjack ] = [
  require('readline'),
  require('./player'),
  require('./bank'),
  require('./dealer'),
  require('./shoe'),
  require('./blackjack')
];

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Driver(house, bank, options) {
  var shoe = new Shoe(options);
  var dealer = new Dealer(shoe, options);
  this.blackjack = new Blackjack(house, dealer, options);

  this.bank = bank;
  this.player = new Player(bank);

  var that = this;

  this.player.on('next', function(hand, against, actions) {
    console.log('[' + hand + '] vs. [' + against + ']');

    var question = '';

    if (actions.hit) question += '(h) hit';
    if (actions.stand) question += ', (s) stand';
    if (actions.double) question += ', (d) double';
    if (actions.split) question += ', (p) split';

    question += '\n';

    var response = function(input) {
      switch (input) {
        case 'h': actions.hit(); break;
        case 's': actions.stand(); break;
        case 'd': actions.double(); break;
        case 'p': actions.split(); break;
        default: {
          console.log('Invalid input: ' + input);
          rl.question(question, response);
        }
      }
    };

    rl.question(question, response);
  });

  var print = function(result, hand, dealerHand) {
    console.log(
      '[ %s ](%s) %s [ %s ](%s)', hand, hand.name, result,
      dealerHand, dealerHand.name
    );
  };

  this.player.on('win', function(hand, dealerHand) {
    print('win', hand, dealerHand);
  });
  this.player.on('lose', function(hand, dealerHand) {
    print('lose', hand, dealerHand);
  });
  this.player.on('push', function(hand, dealerHand) {
    print('push', hand, dealerHand);
  });
  this.blackjack.on('end', () => {
    this.start();
  });
}

Driver.prototype.start = function() {
  this.bank.inquire((err, balance) => {
    if (err) throw new Error(err.name);

    console.log('Your balance is: $' + balance);

    var question = 'Please place bet... ';
    if (this.bet) question += '([enter]) repeat ';
    question += '(a number) bet (e) exit\n';

    rl.question(question, (input) => {
      if (input === 'e') return process.exit();

      if (input !== '' || input === '' && !this.bet) {
        var bet = parseInt(input);
        if (isNaN(bet)) {
          console.log('Invalid number: ' + input);
          return this.start();
        }

        this.bet = bet;
      }

      this.player.play(this.blackjack, this.bet);
    });
  });
};

var house = new Bank();
var bank = new Bank();

bank.deposit(100, function(err) {
  if (err) throw err;
  house.deposit(10000, function(err) {
    if (err) throw err;
    var driver = new Driver(house, bank);
    driver.start();
  });
});

