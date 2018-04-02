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
    this.takeTradeAction = this.takeTradeAction.bind(this);
    this.runTradingPoller = this.runTradingPoller.bind(this);
  }

  addBuyPosition(price, size) {
    console.log(`BUYING ${size} @ ${price}` )
//     GDAXClient.buy({ price, size, product_id: this.world.symbol }, (error, response) => {
// //       {
// //     "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
// //     "price": "0.10000000",
// //     "size": "0.01000000",
// //     "product_id": "BTC-USD",
// //     "side": "buy",
// //     "stp": "dc",
// //     "type": "limit",
// //     "time_in_force": "GTC",
// //     "post_only": false,
// //     "created_at": "2016-12-08T20:02:28.53864Z",
// //     "fill_fees": "0.0000000000000000",
// //     "filled_size": "0.00000000",
// //     "executed_value": "0.0000000000000000",
// //     "status": "pending",
// //     "settled": false
// // }
//       this.world.addBuyPosition(price, size)
//     })

  }
  addSellPosition(price, size) {
    console.log(`SELLING ${size} @ ${price}` )
    GDAXClient.sell({ price, size, product_id: this.world.symbol }, (error, response) => {
      this.world.addSellPosition(price, size)
    })
  }

  takeTradeAction(currentState) {
    console.log(currentState)
    const bestAction = this.world.actions[this.agent.pickBestAction(currentState.id)]
    const actionName = bestAction.name;
    console.log(bestAction)
    console.log(actionName)
    const quantity = this.world.getTradeQuantity(actionName);
    if(actionName === 'BUY'){
      this.addBuyPosition(this.world.getAskPrice(), quantity);
    }

    if(actionName === 'SELL'){
      this.addSellPosition(this.world.getBidPrice(), quantity);
    }
  }

  runTradingPoller() {
    setTimeout(() => {
      this.getNextOrder()
      .then(this.takeTradeAction)
      this.runTradingPoller();
    }, 5000)
  }

  getStepAction() {
    const nextAction = this.agent.pickBestAction(this.stepState);

  }

  setNextState(orderBook) {
    const { marketBids, marketAsks, stateId } = this.world.parseOrderBook(orderBook);
    this.setNewWorldOrderBook({orderBook, marketAsks, marketBids});
    this.stepState = this.getNewStepState(stateId);
    return this.stepState;
  }



  getNextOrder() {
    return new Promise((resolve, reject) => {
      publicClient.getProductOrderBook(
        this.world.symbol,
        { level: 2 },
        (error, response, orderBook) => {
          if(!error){
            resolve(this.setNextState(orderBook))

          }else{
            console.log(error)
          }
        }
      )
    })
  }

  init() {
    DB.query(`select * from qmap where profit=(SELECT max(profit) from qmap);`, (error, response) => {
      const { currentAgent, currentWorld } = response.rows[0].data;
      this.agent.Q = currentAgent.Q;
      this.runTradingPoller();
    })
  }
}


const world = new ExchangeWorld(5, 'ETH-USD', null, {});
const agent = new QLearner(world);
const pair_string = 'ETH-USD';

const tradingAgent = new Trader(agent, world, pair_string);
tradingAgent.init();
