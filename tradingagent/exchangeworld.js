const { StateMachine } = require('./state-machine');

const { ONECOINACTIONS, getNumberOfCombinations } = require('./defaults.js');

// This is a particular kind of state machine, which is
// a grid that lets you move in all directions.
class ExchangeWorld extends StateMachine {
  constructor(oneSideWidth) {
    super();
    this.reset();
    this.init(oneSideWidth);
  }

  reset() {
    this.currentState = 0;
    this.score = 0;
    this.totalSteps = 1;
    this._running = false;
    this.policy = null;
  }

  start(slow = false) {
    this._running = true;
    this._run(slow);
  }

  stop() {
    this._running = false;
    clearTimeout(this._timer);
  }

  _run(slow = false) {
    this.totalSteps++;
    this.doStep();
    if (this._running) {
      this._timer = setTimeout(() => this._run(slow), slow ? 500 : 0);
    }
  }

  doStep() {
    // If we've learned a policy, use that, otherwise
    // just take a random step
    if (this.policy) {
      const bestAction = this.policy[this.currentState];
      const actionName = this.actions[bestAction].name;
      this.currentState = this.takeStep(this.currentState, actionName);
      this.currentState = this.getNextState();
    }

  }



  init(oneSideWidth) {
    this.actions = ONECOINACTIONS;
    let totalCombinations = getNumberOfCombinations(oneSideWidth*2);

    // States
    for (let i = 0; i < oneSideWidth*2; i++) {
      this.states[id] = new State(`s${i}`, i);
    }


    for (let i = 0; i < this.states.length; i++) {
      for (let j = 0; j < this.actions.length; j++) {

        this.addStateAction(i, 0, reward);

        this.addStateAction(i, 1, reward);

        this.addStateAction(i, 2, reward);

        this.addStateAction(i, 3, reward);

      }
    }
  }
}

// // room for expansion

// let actions go further than one step left of right
// let states take history into account
