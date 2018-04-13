class Game {
  constructor(cards) {
    this.minBetAmount = 10;
    this.allowedPlayersQty = 3;
    this.maxScore = 10;
    this.minNaturalValue = 8;
    this.addCardPuntoValue = 5;
    this.cardValuesTable = {
      'A': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 0,
      'J': 0,
      'Q': 0,
      'K': 0,
    };
    this.availableBets = {
      // наверное, лучше добавить id и делать проверки по id
      PUNTO: { title: 'PUNTO', playerBenefit: 1 },
      BANCO: { title: 'BANCO', playerBenefit: 0.95 },
      TIE: { title: 'TIE', playerBenefit: 9 },
    };
    this.cards = cards;

    this.players = [];
    this.playersQueue = [];
    this.dealer = null;
    this.banco = null;
    this.punto = null;
    this.deck = null;
    this.isGameStarted = false;
    this.winner = null;
  }

  get getAllPlayersQty() {
    return this.players.length + this.playersQueue.length;
  }

  initializeNewGame(dealer, Deck, GameMember) {
    this.winner = null;
    this.dealer = dealer;
    this.deck = new Deck(this.cards);
    this.deck.shuffleCards();
    this.banco = new GameMember();
    this.punto = new GameMember();
    // here need to wait until players will be added and make bets
  }

  startGame() {
    this.distributeFirstCards();
    this.isGameStarted = true;
    if (this.checkForNextRound()) {
      this.continueGame();
    } else {
      this.finishGame();
    }
  }

  continueGame() {
    const puntoScore = this.punto.score;
    const bancoScore = this.banco.score;
    if (puntoScore > this.addCardPuntoValue) {
      if (bancoScore <= this.addCardPuntoValue) {
        this.banco.takeCard(this.deck.getNextCard());
      }
    } else {
      const newPuntoCard = this.deck.getNextCard();
      this.punto.takeCard(newPuntoCard);
      const newPuntoCardValue = this.cardValuesTable[newPuntoCard.label];
      if (bancoScore <= 2) {
        this.banco.takeCard(this.deck.getNextCard());
      } else if (bancoScore === 3) {
        if (newPuntoCardValue !== this.minNaturalValue) {
          this.banco.takeCard(this.deck.getNextCard());
        }
      } else if (bancoScore === 4) {
        if (newPuntoCardValue > 1 && newPuntoCardValue < this.minNaturalValue) {
          this.banco.takeCard(this.deck.getNextCard());
        }
      } else if (bancoScore === 5) {
        if (newPuntoCardValue > 3 && newPuntoCardValue < this.minNaturalValue) {
          this.banco.takeCard(this.deck.getNextCard());
        }
      } else if (bancoScore === 6) {
        if (newPuntoCardValue > 5 && newPuntoCardValue < this.minNaturalValue) {
          this.banco.takeCard(this.deck.getNextCard());
        }
      }
      // don't need this condition to be explicit
      // else if (bancoScore === 7) {
      //   return this.finishGame();
      // }
    }
    this.finishGame();
  }

  distributeFirstCards() {
    for (let i = 0; i < 2; i++) {
      this.banco.takeCard(this.deck.getNextCard());
      this.punto.takeCard(this.deck.getNextCard());
    }
  }

  checkForNextRound() {
    this.calculateMembersScore();
    const isBancoHasNC = this.isNC(this.banco.score);
    const isPuntoHasNC = this.isNC(this.punto.score);
    if (isBancoHasNC || isPuntoHasNC) {
      return false;
    }
    return true;
  }

  finishGame() {
    this.calculateMembersScore();
    this.setWinner(this.getWinner());
    this.distributeBenefits();
  }

  getWinner() {
    if (this.banco.score > this.punto.score) {
      return this.availableBets.BANCO;
    } else if (this.banco.score < this.punto.score) {
      return this.availableBets.PUNTO;
    } else {
      return this.availableBets.TIE;
    }
  }

  setWinner(winner) {
    this.winner = winner;
  }

  distributeBenefits() {
    this.players.forEach((player) => {
      const transferAmount = player.betAmount * this.winner.playerBenefit;
      if(player.bet === this.winner.title) {
        this.dealer.getLose(transferAmount);
        player.getWin(transferAmount);
      } else {
        this.dealer.getWin(player.betAmount);
        player.getLose(player.betAmount);
      }
    })
  }

  addPlayer(player) {
    if (this.players.length < this.allowedPlayersQty && !this.isGameStarted) {
      player.prepareGame();
      player.setInitialBet(this.minBetAmount);
      this.players.push(player);
      return true;
    } else if (this.isGameStarted && this.getAllPlayersQty < this.allowedPlayersQty) {
      player.prepareGame();
      this.playersQueue.push(player);
      return true;
    }
    return false;
  }

  calculateMembersScore() {
    this.banco.setScore(this.calculateCardsScore(this.banco.cards));
    this.punto.setScore(this.calculateCardsScore(this.punto.cards));
  }

  calculateCardsScore(cards) {
    const totalScore = cards.reduce((acc, card) => (acc + this.cardValuesTable[card.label]), 0);
    return totalScore % this.maxScore;
  }

  isNC(score) {
    return score >= this.minNaturalValue;
  }

  checkAllPlayersMakeBet() {
    return this.players.every(player => player.bet && player.betAmount !== 0);
  }
}

module.exports = Game;
