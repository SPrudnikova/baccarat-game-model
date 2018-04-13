class Player {
  constructor ({money}) {
    this.money = money;
    this.bet = null;
    this.betAmount = 0;
  }

  makeBet (target) {
    this.bet = target;
  }

  setInitialBet(initialBetAmount) {
    this.betAmount = initialBetAmount;
  }

  increaseBet(diff) {
    this.betAmount = this.betAmount + diff;
  }

  prepareGame () {
    this.bet = null;
    this.betAmount = 0;
  }

  getWin (money) {
    this.money = this.money + money;
  }

  getLose (money) {
    this.money = this.money - money;
  }
}

module.exports = Player;
