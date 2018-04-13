class Dealer {
  constructor ({money}) {
    this.money = money;
    this.additionalMoney = 10000;
  }

  getWin(money) {
    this.money = this.money + money;
  }

  getLose(money) {
    this.money = this.money - money;
  }
}

module.exports = Dealer;
