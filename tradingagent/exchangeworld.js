const { StateMachine } = require('./state-machine');

const { ONECOINACTIONS,
        getNumberOfCombinations,
        BOOKCOMBINATIONS,
         } = require('./defaults.js');

class ExchangeWorld extends StateMachine {
  constructor(oneSideWidth, symbol) {
    super();
    this.reset();
    this.init(oneSideWidth);
  }

  reset() {
    this.currentState = 0;
    this.totalSteps = 1;
    this._running = false;
    this.policy = null;
    this.lastVWAP = 0;
    this.profit = 0;
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
      this.takeStep(this.currentState, actionName);
      this.getNextState();
    }

  }


  init(oneSideWidth) {
    this.actions = ONECOINACTIONS.map((action, index) => {
      return new Action(action, index);
    });

    // States
    for (let i = 0; i < BOOKCOMBINATIONS.length; i++) {
      for(let j = 0; j < BOOKCOMBINATIONS.length. j++) {
        const sells = BOOKCOMBINATIONS[j];
        const buys = BOOKCOMBINATIONS[i];
        const id = `${sells.join()}${buys.join}`;
        this.states[id] = new State(id, sells, buys);
      }
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
