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
  constructor(symbol, price, quantity, id) {
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
    this.id = id;
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
    this.marketBids = [];
    this.marketAsks = [];
    this.lastVWAP = 0;
    this.profit = 0;
    this.cash = 100;
  }

  getBidPrice() {
    return this.marketBids[0].price;
  }

  getAskPrice() {
    return this.marketAsks[0].price;
  }

  getBidQuantity() {
    return this.marketBids[0].quantity;
  }

  getAskQuantity() {
    return this.marketAsks[0].quantity;
  }

  getNextState(state) {
    // this.currentState = []
    return new State('0000011111', [0,0,0,0,0], [1,1,1,1,1]);
  }

  addStateAction(stateId, action, reward) {
    let stateActionsForState = this.stateActions[stateId] || {};
    stateActionsForState[this.actions[action].name] = new StateAction(this.states[stateId], this.actions[action], reward || 0);
    this.stateActions[stateId] = stateActionsForState;
  }

  addBuyPosition(price, quantity) {
    this.buys.push(new Position(this.symbol, price, quantity));
  }

  addSellPosition(price, quantity) {
    this.sells.push(new Position(this.symbol, price, quantity));
  }

  takeStep(state, action) {
    // Can this state take this action?
    const transition = this.stateActions[state.id][action];
    if (transition) {
      //console.log(`${transition.state.id} ${action} ${transition.toState.name}`);
      state = transition.toState.id;
    } else {
      console.log(`${this.states[state.id]} ${action}🚫`);
    }
    return state;
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
