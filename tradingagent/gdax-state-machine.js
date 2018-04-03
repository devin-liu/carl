/******************************
 * State, actions, transitions
 ******************************/
class State {
  constructor(id, bidBook, askBook) {
    this.id = id;
    this.bidBook = bidBook;
    this.askBook = askBook;
  }
}

class Action {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

class StateAction {
   constructor(state, action, reward = 0) {
     this.action = action;
     this.state = state;
     this.reward = reward;
   }
}


class Position {
  constructor(symbol, price, quantity) {
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
  }
}

/******************************
 * State Machine
 ******************************/
class StateMachine {
  constructor(states, actions) {
    this.states = states || {};
    this.actions = actions || [];
    this.stateActions = {};
  }

  getOrderBookSignature() {

  }

  getBidPrice() {
    return parseFloat(this.marketBids[0][0]);
  }

  getAskPrice() {
    return parseFloat(this.marketAsks[0][0]);
  }

  getBidQuantity() {
    return parseFloat(this.marketBids[0][1]);
  }

  getAskQuantity() {
    return parseFloat(this.marketAsks[0][1]);
  }

  getCurrentHoldPosition() {

  }


  updateOrderBook() {

  }


  updateFilledOrders() {

  }

  setPrices() {

  }

  createBuyOrder() {

  }

  createSellOrder() {

  }



// const authedClient = require('./TradeActions.js');



// Open Orders
// authedClient.getOrders({ after: 3000, status: 'open' }, callback);

// Filled Orders
// Param Default Description
// order_id  all Limit list of fills to this order_id
// product_id  all Limit list of fills to this product_id
// authedClient.getFills(callback);



//

// const orderbook = new Gdax.Orderbook();

// orderbook.state
//   function state(book) {
// if (book) {
//   book.bids
//     .forEach(order => this.add({
//        id: order[2],
//        side: \'buy\',
//        price: BigNumber(order[0]),
//        size: BigNumber(order[1]),
//     }));
//   book.asks
//     .forEach(order => this.add({
//        id: order[2],
//        side: \'sell\',
//        price: BigNumber(order[0]),
//        size: BigNumber(order[1]),
//     }));
//     } else {
//   book = { asks: [], bids: [] };
//   this._bids.reach(bid => book.bids.push(...bid.orders));
//   this._asks.each(ask => book.asks.push(...ask.orders));
//   return book;
// }'

// Pricing Model for Bids
// Tiers -> ??? -> sell for [bid*(.96)..(1.04)]
// Step 1 Reward for getting order filled
// Step 2 Reward for profit
// Discount for transaction fee

// Pricing Model for Asks
// Tiers -> ??? -> buy for [asks*(.96)..(1.04)]
// Step 1 Reward for getting order filled
// Step 2 Reward for profit
// Discount for transaction fee



// Parse through trades
//



  // subscrube to ticker channel
  // {
  //   "type": "ticker",
  //   "trade_id": 20153558,
  //   "sequence": 3262786978,
  //   "time": "2017-09-02T17:05:49.250000Z",
  //   "product_id": "BTC-USD",
  //   "price": "4388.01000000",
  //   "side": "buy", // Taker side
  //   "last_size": "0.03000000",
  //   "best_bid": "4388",
  //   "best_ask": "4388.01"
  // }


  // subscrive to user channel
//   {
//     "type": "subscribe",
//     "channels": [{ "name": "user", "product_ids": ["ETH-USD"] }]
  // }




  // set up socket feed
  // delegate out events
  // set order book

}








// Build state machine based on live GDAX feed
// Keep track of account USD
// Keep track of account ETH
// Place buy orders
// Cancel orders on motion
// Record orders that are filled
//  Set # ETH
//  Set # USD
// Record orders that are cancelled
//  Set # ETH
//  Set # USD
// Record orders that have a transaction fee
// Keep track of profit

