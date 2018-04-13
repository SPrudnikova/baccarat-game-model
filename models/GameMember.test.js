const GameMember = require('./GameMember');
const Card = require('./Card');

describe('game member entity', () => {

  it('create game member correctly', () => {
    const gameMember = new GameMember();
    expect(gameMember.score).toBe(0);
    expect(gameMember.cards.length).toBe(0);
  });

  it('take card correctly', () => {
    const gameMember = new GameMember();
    gameMember.takeCard(new Card({"label": "K", "suit": "spades"}));
    expect(gameMember.cards.length).toBe(1);
  });

  it('set score correctly', () => {
    const gameMember = new GameMember();
    gameMember.setScore(9);
    expect(gameMember.score).toBe(9);
  });

  it('reset correctly', () => {
    const gameMember = new GameMember();
    gameMember.reset();
    expect(gameMember.score).toBe(0);
    expect(gameMember.cards.length).toBe(0);
  });

});
