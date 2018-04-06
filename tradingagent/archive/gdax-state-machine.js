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

    //   {
    // "type": "done",
    // "time": "2014-11-07T08:19:27.028459Z",
    // "product_id": "BTC-USD",
    // "sequence": 10,
    // "price": "200.2",
    // "order_id": "d50ec984-77a8-460a-b958-66f114b0de9b",
    // "reason": "filled", // or "canceled"
    // "side": "sell",
    // "remaining_size": "0"
    //   }

    // {
    // "type": "match",
    // "trade_id": 10,
    // "sequence": 50,
    // "maker_order_id": "ac928c66-ca53-498f-9c13-a110027a60e8",
    // "taker_order_id": "132fb6ae-456b-4654-b4e0-d681ac05cea1",
    // "time": "2014-11-07T08:19:27.028459Z",
    // "product_id": "BTC-USD",
    // "size": "5.23512",
    // "price": "400.23",
    // "side": "sell"
    // }
//  Set # USD
// Record orders that are cancelled
//  Set # ETH
//  Set # USD
// Record orders that have a transaction fee
// Keep track of profit



// F(INIT, INIT, P) = (COUNTER <= L)
// Initialize until enough price updates have been gathered
// F(INIT, LONG, P) = (AND(COUNTER > L)(P > MA))
// F(INIT, SHORT, P) = (AND(COUNTER > L)(P <= MA))
// F(LONG, INIT, P) = NIL
// F(LONG, LONG, P) = (P > MA)
// F(LONG, SHORT, P) = (P <= MA) F(SHORT, INIT, P) = NIL
// F(SHORT, LONG, P) = (P > MA)
// F(SHORT, SHORT, P) = (P <= MA)
