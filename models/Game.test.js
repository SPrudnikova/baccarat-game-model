const deckJson = require('./CardDeck.json');
const CardDeck = require('./CardDeck.js');
const Card =  require('./Card');
const Game =  require('./Game');
const Player = require('./Player');
const Dealer = require('./Dealer');
const GameMember = require('./GameMember');

describe('game tests', () => {

  const praparedGame = () => {
    const game = new Game(deckJson);
    const dealer = new Dealer({money: 10000});
    game.initializeNewGame(dealer, CardDeck, GameMember);

    const playerA = new Player({money: 5000});
    game.addPlayer(playerA);
    playerA.makeBet('PUNTO');

    const playerB = new Player({money: 5000});
    game.addPlayer(playerB);
    playerB.makeBet('BANCO');

    game.distributeFirstCards = jest.fn();
    return game;
  };

  const checkPuntoWins = (game) => {
    expect(game.winner.title).toBe('PUNTO');
    expect(game.dealer.money).toBe(10000);
    expect(game.players[0].money).toBe(5010);
    expect(game.players[1].money).toBe(4990);
  };

  const checkBancoWins = (game) => {
    expect(game.winner.title).toBe('BANCO');
    expect(game.dealer.money).toBe(10000.5);
    expect(game.players[0].money).toBe(4990);
    expect(game.players[1].money).toBe(5009.5);
  };

  it('start game properly', () => {
    const game = new Game(deckJson);
    const dealer = new Dealer({money: 10000});
    game.initializeNewGame(dealer, CardDeck, GameMember);

    const playerA = new Player({money: 5000});
    game.addPlayer(playerA);
    playerA.makeBet('PUNTO');
    const playerB = new Player({money: 5000});
    game.addPlayer(playerB);
    playerA.makeBet('BANCO');

    game.punto.takeCard(new Card({label:'5', suit: 'hearts'}));
    game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));
    game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
    game.banco.takeCard(new Card({label:'9', suit: 'hearts'}));

    game.distributeFirstCards = jest.fn();
    game.startGame();
    game.deck.getNextCard();
    game.deck.getNextCard();
    game.deck.getNextCard();
    game.deck.getNextCard();

    expect(game.players.length).toBe(2);
    expect(game.deck.cards.length).toBe(48);
    expect(game.punto.cards.length).toBe(2);
    expect(game.banco.cards.length).toBe(2);
  });

  it('calculate score', () => {
    const game = praparedGame();
    game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
    game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));
    expect(game.punto.cards.length).toBe(2);
    expect(game.calculateCardsScore(game.punto.cards)).toBe(3);

    game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
    game.banco.takeCard(new Card({label:'9', suit: 'hearts'}));
    expect(game.banco.cards.length).toBe(2);
    expect(game.calculateCardsScore(game.banco.cards)).toBe(2);
  });

  it('punto has natural combination', () => {
    const game = praparedGame();
    game.punto.takeCard(new Card({label:'5', suit: 'hearts'}));
    game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

    game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
    game.banco.takeCard(new Card({label:'9', suit: 'hearts'}));
    game.startGame();
    checkPuntoWins(game);
  });

  it('banco has natural combination', () => {
    const game = praparedGame();
    game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));
    game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

    game.banco.takeCard(new Card({label:'4', suit: 'hearts'}));
    game.banco.takeCard(new Card({label:'5', suit: 'hearts'}));
    game.startGame();
    checkBancoWins(game);
  });

  describe('punto - 6,7 score', () => {

    it('punto - 4,3; banco - 3,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'4', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
    });

    it('punto - 4,3; banco - 3,2,8', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'4', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'8', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.banco.score).toBe(3);
      expect(game.punto.score).toBe(7);
    });

    it('punto - 4,3; banco - 3,2,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'4', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'3', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.banco.score).toBe(8);
      expect(game.punto.score).toBe(7);
    });

  });

  describe('punto - 0-5 score, banco - 0-2score', () => {

    it('punto - 2,2,2; banco - Q,A,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'Q', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'A', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'2', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(6);
      expect(game.banco.score).toBe(3);
    });

    it('punto - Q,A,2; banco - Q,2,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'Q', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'2', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(3);
      expect(game.banco.score).toBe(4);
    });

  });

  describe('punto - 0-5 score, banco - 3score', () => {

    it('punto - A,3,2; banco - A,2,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'2', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(6);
      expect(game.banco.score).toBe(5);
    });

    it('punto - A,3,6; banco - A,2,6', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'6', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(0);
      expect(game.banco.score).toBe(9);
    });

    it('punto - A,Q,8; banco - A,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'8', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(9);
      expect(game.banco.score).toBe(3);
    });

    it('punto - A,3,8; banco - A,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'8', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(2);
      expect(game.banco.score).toBe(3);
    });

  });

  describe('punto - 0-5 score, banco - 4score', () => {

    it('punto - A,Q,7; banco - 2,2,7', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'7', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(8);
      expect(game.banco.score).toBe(1);
    });

    it('punto - A,2,4; banco - 2,2,4', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'4', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(7);
      expect(game.banco.score).toBe(8);
    });

    it('punto - A,Q,8; banco - 2,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'8', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(9);
      expect(game.banco.score).toBe(4);
    });

    it('punto - A,2,Q; banco - 2,2', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'Q', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(3);
      expect(game.banco.score).toBe(4);
    });

  });

  describe('punto - 0-5 score, banco - 5score', () => {

    it('punto - A,Q,7; banco - 2,3,7', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'7', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(8);
      expect(game.banco.score).toBe(2);
    });

    it('punto - A,2,4; banco - 2,3,4', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'4', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(7);
      expect(game.banco.score).toBe(9);
    });

    it('punto - A,Q,8; banco - 2,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'8', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(9);
      expect(game.banco.score).toBe(5);
    });

    it('punto - A,2,Q; banco - 2,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'2', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'Q', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(3);
      expect(game.banco.score).toBe(5);
    });

  });

  describe('punto - 0-5 score, banco - 6score', () => {

    it('punto - Q,Q,7; banco - 3,3,7', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'Q', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'7', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(7);
      expect(game.banco.score).toBe(3);
    });

    it('punto - A,2,7; banco - 3,3,7', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'7', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(0);
      expect(game.banco.score).toBe(3);
    });

    it('punto - A,2,5; banco - 3,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'5', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(8);
      expect(game.banco.score).toBe(6);
    });

    it('punto - A,2,Q; banco - 3,3', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'Q', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(3);
      expect(game.banco.score).toBe(6);
    });

  });

  describe('punto - 0-5 score, banco - 7score', () => {

    it('punto - A,2,6; banco - 3,4', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'4', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'6', suit: 'hearts'}));
      game.startGame();
      checkPuntoWins(game);
      expect(game.punto.score).toBe(9);
      expect(game.banco.score).toBe(7);
    });

    it('punto - A,2,2; banco - 3,4', () => {
      const game = praparedGame();
      game.punto.takeCard(new Card({label:'A', suit: 'hearts'}));
      game.punto.takeCard(new Card({label:'2', suit: 'hearts'}));

      game.banco.takeCard(new Card({label:'3', suit: 'hearts'}));
      game.banco.takeCard(new Card({label:'4', suit: 'hearts'}));

      game.deck.getNextCard = jest.fn(() => new Card({label:'2', suit: 'hearts'}));
      game.startGame();
      checkBancoWins(game);
      expect(game.punto.score).toBe(5);
      expect(game.banco.score).toBe(7);
    });

  });

});
