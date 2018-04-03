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
