const Card = require('./Card');

describe('card entity', () => {

  it('create card correctly', () => {
    const card = new Card({"label": "K", "suit": "spades"});
    expect(card.label).toBe("K");
    expect(card.suit).toBe("spades");
  });

});
