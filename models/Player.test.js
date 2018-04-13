const Player = require('./Player');

describe('player entity', () => {

  it('create player correctly', () => {
    const player = new Player({money: 5000});
    expect(player.money).toBe(5000);
    expect(player.bet).toBe(null);
    expect(player.betAmount).toBe(0);
  });

  it('make bet correctly', () => {
    const player = new Player({money: 5000});
    player.makeBet('PUNTO');
    expect(player.bet).toBe('PUNTO');
  });

  it('set initial bet amount correctly', () => {
    const player = new Player({money: 5000});
    player.setInitialBet(10);
    expect(player.betAmount).toBe(10);
  });

  it('increase bet correctly', () => {
    const player = new Player({money: 5000});
    player.setInitialBet(10);
    player.increaseBet(5);
    player.increaseBet(5);
    expect(player.betAmount).toBe(20);
  });

  it('get lose correctly', () => {
    const player = new Player({money: 5000});
    player.getLose(1000);
    expect(player.money).toBe(4000);
  });

  it('get win correctly', () => {
    const player = new Player({money: 5000});
    player.getWin(1000);
    expect(player.money).toBe(6000);
  });

  it('make game flow correct', () => {
    const player = new Player({money: 5000});
    player.setInitialBet(10);
    player.makeBet('PUNTO');
    player.increaseBet(5);
    player.increaseBet(5);
    player.increaseBet(5);
    expect(player.bet).toBe('PUNTO');
    expect(player.betAmount).toBe(25);
    player.getWin(1000);
    expect(player.money).toBe(6000);
    player.prepareGame();
    expect(player.bet).toBe(null);
    expect(player.betAmount).toBe(0);
  });

});
