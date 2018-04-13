const Dealer = require('./Dealer');

describe('dealer entity', () => {

  it('create dealer correctly', () => {
    const dealer = new Dealer({money: 10000});
    expect(dealer.money).toBe(10000);
    expect(dealer.additionalMoney).toBe(10000);
  });

  it('get lose correctly', () => {
    const dealer = new Dealer({money: 10000});
    dealer.getLose(1000);
    expect(dealer.money).toBe(9000);
  });

  it('get win correctly', () => {
    const dealer = new Dealer({money: 10000});
    dealer.getWin(1000);
    expect(dealer.money).toBe(11000);
  });

});
