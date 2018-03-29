/******************************
 * State, actions, transitions
 ******************************/
class State {
  constructor(name, id, buyBook, sellBook) {
    this.name = name;
    this.id = id;
    this.buyBook = buyBook;
    this.sellBook = sellBook;
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

/******************************
 * State Machine
 ******************************/
class StateMachine {
  constructor(states, actions) {
    this.states = states || [];
    this.actions = actions || [];
    this.transitions = {};
  }

  addStateAction(state, action, reward) {
    let transitionsForState = this.transitions[state] || {};
    transitionsForState[this.actions[action].name] = new StateAction(this.states[state], this.actions[action], reward || 0);
    this.transitions[state] = transitionsForState;
  }

  takeStep(state, action) {
    // Can this state take this action?
    const transition = this.transitions[state][action];
    if (transition) {
      //console.log(`${transition.state.name} ${action} ${transition.toState.name}`);
      state = transition.toState.id;
    } else {
      console.log(`${this.states[state].name} ${action}🚫`);
    }
    return state;
  }

  takeRandomStep(state) {
    // Pick a random action from the available ones
    const availableStateActions = this.transitions[state];
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
}

module.exports = {
  StateMachine,
  State,
  Action,
  StateAction
};
