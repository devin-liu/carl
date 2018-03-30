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
    this.buys = [];
    this.sells = [];
    this.holdQuantity = 0;
    this.marketBids = null;
    this.marketAsks = null;
    this.lastVWAP;
    this.profit = 0;
    this.cash = 100;
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

  parseOrderBook(orderBook) {
    const lastVWAP = this.lastVWAP;
    // let marketBids = orderBook.bids.slice(0,5).map(bid => bid[0] > lastVWAP ? 1 : 0);
    // let marketAsks = orderBook.asks.slice(0,5).map(bid => bid[0] < lastVWAP ? 1 : 0);
    const marketBids = orderBook.bids.slice(0,5);
    const marketAsks = orderBook.asks.slice(0,5);
    const marketBidState = marketBids.map(bid => bid[0] > lastVWAP ? 1 : 0);
    const marketAskState = marketAsks.map(bid => bid[0] < lastVWAP ? 1 : 0);
    const bidSignature = marketBidState.length < 5 ? `${marketBidState.join('')}${'0'.repeat(5-marketBidState.length)}` : `${marketBidState.join('')}`;
    const askSignature = marketAsks.length < 5 ? `${marketAskState.join('')}${'0'.repeat(5-marketAskState.length)}` : `${marketAskState.join('')}`;
    const stateId = `${bidSignature}${askSignature}`;
    return { marketBids, marketAsks, stateId }
  }

  setOrderBook({ marketAsks, marketBids }) {
    this.marketAsks = marketAsks;
    this.marketBids = marketBids;
  }

  addStateAction(stateId, action, reward) {
    let stateActionsForState = this.stateActions[stateId] || {};
    stateActionsForState[this.actions[action].name] = new StateAction(this.states[stateId], this.actions[action], reward || 0);
    this.stateActions[stateId] = stateActionsForState;
  }

  addBuyPosition(price, quantity) {
    this.holdQuantity += quantity;
    this.buys.push(new Position(this.symbol, price, quantity));
  }

  addSellPosition(price, quantity) {
    this.holdQuantity -= quantity;
    this.sells.push(new Position(this.symbol, price, quantity));
  }

  takeStep(actionName, quantity) {
    if(actionName === 'BUY'){
      this.addBuyPosition(this.getAskPrice(), quantity);
      this.setLastVWAP();
    }
    if(actionName === 'SELL'){
      this.addSellPosition(this.getBidPrice(), quantity);

    }
    if(actionName === 'HODL'){
      return 0;
    }
    if(actionName === 'CLEAR'){
      this.buys = [];
      this.sells = [];
    }
  }

  takeRandomStep(state) {
    // Pick a random action from the available ones
    const availableStateActions = this.stateActions[state.id];
    const availableActions = Object.keys(availableStateActions)
    const action = availableActions[this.pickRandomNumber(availableActions.length)];
    return this.takeStep(state, action);
  }

  pickRandomNumber(num) {
    return Math.floor(Math.random() * num);
  }

  pickRandomState() {
    return this.pickRandomNumber(this.states.length);
  }

  clearBalance() {
    this.buys = [];
    this.sells = [];
  }

}

module.exports = {
  StateMachine,
  State,
  Action,
  StateAction
};
