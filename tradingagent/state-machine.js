/******************************
 * State, actions, transitions
 ******************************/
class State {
  constructor(id, sellBook, buyBook) {
    this.id = id;
    this.sellBook = sellBook;
    this.buyBook = buyBook;
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
    this.lastVWAP = 0;
    this.profit = 0;
  }

  addStateAction(stateId, action, reward) {
    let transitionsForState = this.stateActions[stateId] || {};
    stateActionsForState[this.actions[action].name] = new StateAction(this.states[stateId], this.actions[action], reward || 0);
    this.stateActions[stateId] = stateActionsForState;
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


  getStepReward(actionName) {


  }

  getNextState(state) {
    // this.currentState = []
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

  getTotalQuantity(positions) {
    return positions.reduce((a,b) => a.quantity + b.quantity);
  }

  getTotalPositionPrice(positions) {
    return positions.reduce((a,b) => a.quantity * a.price + b.quantity * b.price);
  }

  getVWAP(positions) {
    const totalAmount = this.getTotalQuantity(positions);
    const quantitys = positions.map(position => position.price*(position.quantity/totalAmount));
    return quantitys.reduce((a,b) => a + b);
  }













  buy(price, quantity) {
    this.buys.push(new Position(this.symbol, price, quantity));
  }

  sell(price, quantity) {
    this.sells.push(new Position(this.symbol, price, quantity));
  }

  clearBalance() {
    this.buys = [];
    this.sells = [];
  }

  calculateProfit() {
    const cost = this.getTotalPositionPrice(this.buys);
    const revenue = this.getTotalPositionPrice(this.sells);
    return revenue - cost;
  }

  setLastVWAP() {
    this.lastVWAP = this.getVWAP(this.buys);
  }

}

module.exports = {
  StateMachine,
  State,
  Action,
  StateAction
};
