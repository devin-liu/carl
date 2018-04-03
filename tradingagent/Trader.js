const DB = require('../datafeed/Database/index.js');
const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');
const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();
const Trainer = require('./train.js');
const authedClient = require('./TradeActions.js');

class Trader extends Trainer {
  constructor(agent, world, symbol) {
    super(agent, world, symbol)
    this.setNextState = this.setNextState.bind(this);
    this.takeTradeAction = this.takeTradeAction.bind(this);
    this.runTradingPoller = this.runTradingPoller.bind(this);
    this.saveCurrentState = this.saveCurrentState.bind(this);
  }

  addBuyPosition(price, size) {
    console.log(`BUYING ${size} @ ${price}` )
    if(this.world.cash >= price*size){
      this.world.takeStep('BUY', size)
      // authedClient.buy({ price, size, product_id: this.world.symbol }, (error, response) => {
      //   console.log(response)
      //   this.world.takeStep('BUY', size)
      // })
    }


  }
  addSellPosition(price, size) {
    console.log(`SELLING ${size} @ ${price}` )
    if(this.world.holdQuantity >= size){
      this.world.takeStep('SELL', size)
      // authedClient.sell({ price, size, product_id: this.world.symbol }, (error, response) => {
      //   console.log(response)
      //   this.world.takeStep('SELL', size)
      // })
    }
  }

  saveCurrentState() {
    const currentAgent = this.agent;
    const currentWorld = this.world;
    const profit = currentWorld.calculateProfit();
    const qs = `INSERT INTO qmap (data, pair_string, profit) values ('${JSON.stringify({currentWorld,currentAgent,profit})}', '${this.world.symbol}', ${profit});`;
    DB.query(qs);
  }

  takeTradeAction(currentState) {
    const currentStateAction = this.agent.Q[currentState.id];
    const bestAction = this.agent.pickEpsilonGreedyAction(currentStateAction)
    // const bestAction = this.agent.pickBestAction(currentStateAction)
    // console.log(`bestAction: ${bestAction}`)
    const quantity = this.world.getTradeQuantity(bestAction);
    const stepReward = this.world.getStepReward(bestAction, quantity);
    const learntReward = this.agent.gamma * stepReward;
    // const stepValue = this.agent.alpha * (learntReward - this.agent.Q[state.id][bestAction])
    const stepValue = this.agent.alpha * (learntReward)
    this.agent.Q[currentState.id] += stepValue;
    if(bestAction === 'BUY'){
      // this.addBuyPosition(this.world.getAskPrice(), quantity);
      // this.addBuyPosition(this.world.getAskPrice()*.995, quantity);
      this.addBuyPosition(this.world.getBidPrice(), quantity);
    }

    if(bestAction === 'SELL'){
      // this.addSellPosition(this.world.getBidPrice(), quantity);
      // this.addSellPosition(this.world.getBidPrice()*1.005, quantity);
      this.addSellPosition(this.world.getAskPrice(), quantity);
    }
  }

  runTradingPoller(currentIteration=1) {
    if(currentIteration % 200 === 0) this.saveCurrentState();
    setTimeout(() => {
      this.getNextOrder()
      .then(this.takeTradeAction)
      .catch(e => console.log(e))
      this.runTradingPoller(currentIteration+1);
    }, 3000)
  }

  setNextState(orderBook) {
    const { marketBids, marketAsks, stateId } = this.world.parseOrderBook(orderBook);
    console.log(`Current World State: ${stateId}`)
    console.log(`holdQuantity: ${this.world.holdQuantity}`)
    console.log(`Cash: ${this.world.cash}`)
    this.world.setOrderBook({ marketAsks, marketBids });
    // this.setNewWorldOrderBook({orderBook, marketAsks, marketBids});
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
            const qs = `INSERT INTO orderbook (data, pair_string) values ('${JSON.stringify(orderBook)}', '${this.world.symbol}');`;
            DB.query(qs);
          }else{
            console.log(error)
            reject(error)
          }
        }
      )
    })
  }

  getFirstOrder() {
    return new Promise((resolve, reject) => {
      publicClient.getProductOrderBook(
        this.world.symbol,
        { level: 2 },
        (error, response, orderBook) => {
          if(!error){
            this.world.firstVWAP = orderBook.asks[0][0];
            console.log(this.world.firstVWAP)
            resolve(this.world.firstVWAP);
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
      this.getFirstOrder()
      .then((orderBook) => {
        this.agent.reset();
        this.world.reset();
        this.agent.Q = currentAgent.Q;
        console.log(this.agent.Q)
        this.runTradingPoller()
      })
    })
  }
}


// const world = new ExchangeWorld(5, 'ETH-USD', null, {});
// const agent = new QLearner(world);
// const pair_string = 'ETH-USD';

const world = new ExchangeWorld(5, 'ETH-USD', null, {});
const agent = new QLearner(world);
const pair_string = 'ETH-USD';

const tradingAgent = new Trader(agent, world, pair_string);
tradingAgent.init();
