const DB = require('../datafeed/Database/index.js');
const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');
const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();
const Trainer = require('./train.js');
const GDAXClient = require('./TradeActions.js');

class Trader extends Trainer {
  constructor(agent, world, symbol) {
    super(agent, world, symbol)
    this.setNextState = this.setNextState.bind(this);
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

  takeTradeAction() {
    const bestAction = this.pickEpsilonGreedyAction(this.Q[state.id]);
    const quantity = this.world.getTradeQuantity(bestAction);
    if(bestAction === 'BUY'){
      this.addBuyPosition(this.world.getAskPrice(), quantity);
    }

    if(bestAction === 'SELL'){
      this.addSellPosition(this.world.getBidPrice(), quantity);
    }
  }

  runTradingPoller() {
    setTimeout(() => {
      this.getNextOrder()
      .then(this.takeTradeAction)
      runTradingPoller();
    }, 5000)
  }

  getStepAction() {
    const nextAction = this.agent.pickBestAction(this.stepState);

  }

  setNextState(orderBook) {
    const { marketBids, marketAsks, stateId } = this.world.parseOrderBook(orderBook);
    this.setNewWorldOrderBook({orderBook, marketAsks, marketBids});
    this.stepState = this.getNewStepState(stateId);
  }



  getNextOrder() {
    return publicClient.getProductOrderBook(
      this.world.symbol,
      { level: 2 },
      (error, response, orderBook) => {
        if(!error){
          this.setNextState(orderBook)
        }else{
          console.log(error)
        }
      }
    )
  }

  init() {
    DB.query(`select * from qmap where profit=(SELECT max(profit) from qmap);`, (error, response) => {
      const { currentAgent, currentWorld } = response.rows[0].data;
      this.agent.Q = currentAgent.Q;
    })
  }
}


const world = new ExchangeWorld(5, 'ETH-USD', null, {});
const agent = new QLearner(world);
const pair_string = 'ETH-USD';

const tradingAgent = new Trader(agent, world, pair_string);
tradingAgent.init();
