const Card = require('./Card');

class CardDeck {
  constructor(cards) {
    this.cards = cards.map(card => new Card(card));
  }

  shuffleCards() {
    const deckLength = this.cards.length;
    this.cards.forEach((card, i) => {
      const randomInt = Math.floor(Math.random() * (deckLength - i));
      const index = randomInt + i;
      const temp = this.cards[i];
      this.cards[i] = this.cards[index];
      this.cards[index] = temp;
    });
    return this.cards;
  }

  getNextCard() {
    return this.cards.pop();
  }
}

module.exports = CardDeck;
