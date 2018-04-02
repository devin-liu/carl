const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');
const GDAXClient = require('./TradeActions.js');

class Trader {
  constructor(agent, world) {
    this.agent = agent;
    this.world = world;
  }

  addBuyPosition(price, size) {
    GDAXClient.buy({ price, size, product_id: this.world.symbol }, () => {
      this.world.addBuyPosition(price, size)
    })

  }
  addSellPosition(price, size) {
    GDAXClient.sell({ price, size, product_id: this.world.symbol }, () => {
      this.world.addSellPosition(price, size)
    })
  }
}
