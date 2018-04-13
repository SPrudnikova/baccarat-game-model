class GameMember {
  constructor () {
    this.cards = [];
    this.score = 0;
  }

  takeCard(card) {
    this.cards.push(card);
  }

  setScore(score) {
    this.score = score;
  }

  reset() {
    this.cards = [];
    this.score = 0;
  }
}

module.exports = GameMember;
