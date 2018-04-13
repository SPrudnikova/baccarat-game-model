const deck = require('./CardDeck.json');
const CardDeck = require('./CardDeck.js');
const Card =  require('./Card');

describe('card deck', () => {

  it('make card deck', () => {
    const newDeck = new CardDeck(deck);
    expect(newDeck.cards.length).toBe(52);
  });

  it('gives 1 card correct', () => {
    const newDeck = new CardDeck(deck);
    const card = newDeck.getNextCard();
    expect(newDeck.cards.length).toBe(51);
    expect(card).toEqual(new Card({"label": "K", "suit": "spades"}));
  });

  it('shuffles card', () => {
    const initialDeck = new CardDeck(deck);
    const newDeck = new CardDeck(deck);
    newDeck.shuffleCards();
    expect(newDeck.cards.length).toBe(52);
    expect(newDeck.cards).not.toEqual(initialDeck.cards);
  });

});
