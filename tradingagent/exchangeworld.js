const { StateMachine } = require('./state-machine');

// This is a particular kind of state machine, which is
// a grid that lets you move in all directions.
class ExchangeWorld extends StateMachine {
  constructor(size) {
    super();
    this.reset();
    this.init(size);
  }

  reset() {
    this.currentState = 0;
    this.goalState = 76;
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
    } else {
      this.currentState = this.takeRandomStep(this.currentState);
    }

    if (this.currentState === this.goalState) {
      this.score++;
      // Start in a random state to make it interesting.
      this.currentState = this.pickRandomState();
    }
  }

  init(size) {
    this.actions = [
    new Action('buyETH️', 0),
    new Action('buyBTC️', 1),
    new Action('buyLTC️', 2),
    new Action('buyBCH️', 3),
    new Action('sellETH️', 5),
    new Action('sellBTC️', 6),
    new Action('sellLTC️', 7),
    new Action('sellBCH️', 8),
    new Action('HODL️', 9),
    ];

    // States
    for (let i = 0; i < size * size; i++) {
      this.states.push(new State(`s${i}`, i));
    }

    for (let i = 0; i < this.states.length; i++) {
      for (let j = 0; j < this.states.length; j++) {
        const reward = (j === this.goalState) ? 1 : 0;




        // trade LTC/ETH/BTC/BCH
        // buyETH()
        // buyBTC()
        // buyLTC()
        // buyBCH()
        // sellETH()
        // sellBTC()
        // sellLTC()
        // sellBCH()
        // HODL


        // i ⬆️ j (and it doesn't go in the negatives)
        if (i - j === size) {
          this.addTransition(i, j, 0, reward);
        }
        // i ⬇️ j
        if (j - i === size) {
          this.addTransition(i, j, 1, reward);
        }
        // i ⬅️ j (and it doesn't wrap on the previous row)
        if (i - j === 1 && (j % size !== size - 1)) {
          this.addTransition(i, j, 2, reward);
        }
        // i ➡️ j (and it doesn't wrap on the next row)
        if (j - i === 1 && (j % size !== 0)) {
          this.addTransition(i, j, 3, reward);
        }




        // {"asks": [["7850.01", "2.7420122", 5], ["7850.02", "0.0010827", 1], ["7850.03", "0.00108242", 1], ["7850.5", "0.1", 1], ["7850.54", "0.00146451", 1], ["7850.55", "0.00108267", 1], ["7850.58", "0.02597986", 2], ["7851.39", "0.00146438", 1], ["7853.25", "0.00197343", 1], ["7853.91", "0.00159125", 1], ["7853.98", "0.00184604", 1], ["7854", "0.00108188", 1], ["7854.01", "0.0013366", 1], ["7854.02", "0.00108222", 1], ["7854.03", "0.00210065", 1], ["7854.05", "0.00222799", 1], ["7854.48", "0.00197336", 1], ["7854.49", "0.10146382", 2], ["7854.96", "0.00108184", 1], ["7854.97", "0.00146403", 1], ["7854.98", "0.00133661", 1], ["7854.99", "0.00108188", 1], ["7855", "0.00235501", 1], ["7855.01", "0.00235494", 1], ["7855.02", "0.001", 1], ["7856.03", "0.00146361", 1], ["7856.04", "0.001", 1], ["7857.85", "0.0064675", 1], ["7857.9", "0.1", 1], ["7860", "0.015", 1], ["7860.01", "0.03808138", 2], ["7860.04", "0.001", 1], ["7862.48", "1.27287", 1], ["7862.59", "1.488", 1], ["7862.7", "8.6822", 2], ["7864", "0.6", 1], ["7864.11", "0.8", 1], ["7865", "0.016", 2], ["7865.72", "0.9", 1], ["7867.02", "0.001", 1], ["7868.08", "0.9", 1], ["7868.38", "0.5", 1], ["7869.65", "0.9", 1], ["7870", "0.015", 1], ["7870.75", "1.79932644", 1], ["7872.02", "0.001", 1], ["7873.82", "7.4", 1], ["7874", "0.2", 1], ["7874.84", "0.021", 1], ["7875", "0.015", 1]], "bids": [["7850", "45.51844405", 41], ["7849.99", "0.015676", 2], ["7849.05", "0.00100314", 1], ["7849.03", "0.005", 2], ["7849", "0.5", 1], ["7848.6", "7.2", 1], ["7848.52", "0.01274126", 1], ["7847.65", "0.006", 2], ["7847.51", "0.1", 1], ["7847.01", "0.001", 1], ["7847", "0.056", 2], ["7846.93", "0.001", 1], ["7846.61", "0.02139987", 2], ["7846.04", "0.00686238", 1], ["7845.45", "0.591205", 2], ["7845.17", "0.25367", 1], ["7845.01", "0.00500318", 2], ["7845", "0.019", 2], ["7844.68", "0.0067111", 1], ["7844.39", "9.01", 2], ["7844.12", "0.024", 2], ["7844.01", "0.026", 2], ["7844", "0.09552", 3], ["7843.94", "8.49", 1], ["7843.64", "0.01076237", 2], ["7843.33", "0.2035", 2], ["7842.89", "0.5060179", 3], ["7842.12", "10.004", 2], ["7842.11", "15.6", 1], ["7842.05", "0.005", 2], ["7842", "0.00834379", 2], ["7841.92", "0.005", 2], ["7841.84", "0.00500327", 2], ["7841.2", "0.5", 1], ["7840.8", "0.00320024", 1], ["7840.45", "0.01406378", 2], ["7840.33", "1", 1], ["7840.11", "0.204", 2], ["7840.01", "0.005", 2], ["7840", "5.97826633", 10], ["7839.93", "0.01088608", 2], ["7839.84", "7.25", 1], ["7839.5", "0.01741565", 1], ["7839.44", "0.004", 1], ["7839.3", "0.111", 1], ["7838.9", "1.352", 1], ["7838.37", "0.1275", 1], ["7838.01", "0.00100338", 1], ["7837", "0.05", 1], ["7836.91", "0.001", 1]], "sequence": 5530176334}






      }
    }
  }
}
