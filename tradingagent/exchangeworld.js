const {
        StateMachine,
        State,
        Action,
        StateAction
      } = require('./state-machine');

const { ONECOINACTIONS,
        getNumberOfCombinations,
        BOOKCOMBINATIONS,
       } = require('./defaults.js');

class ExchangeWorld extends StateMachine {
  constructor(oneSideWidth, symbol, firstVWAP, orderBook) {
    super();
    this.reset();
    this.init(oneSideWidth);
    this.symbol = symbol
    this.firstVWAP = firstVWAP;
    this.orderBook = orderBook;
  }

  reset() {
    this.currentState = null;
    this.totalSteps = 1;
    this._running = false;
    this.policy = null;
    this.lastVWAP = this.firstVWAP;
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
      const bestAction = this.policy[this.currentState.id];
      const actionName = this.actions[bestAction].name;
      this.takeStep(this.currentState.id, actionName);
    }else{
      console.log('lol this dont work!')
    }
    this.getNextState();

  }


  getMaxRiskCash() {
    const cash = this.cash;
    if(cash > 1000){
      return cash*.05;
    } else if(cash > 100){
      return cash*.1;
    }else if(cash > 50) {
      return cash*.2;
    }else if (cash > 10){
      return cash*.4;
    }else{
      return cash*.5;
    }

  }

  getTradeQuantity(actionName) {
    // return Math.random()*10;
    const maxRiskCash = this.getMaxRiskCash();
    if(actionName === 'BUY'){
      const price = this.getTradePrice(actionName);
      return Math.min((maxRiskCash / price), this.getAskQuantity());
    }
    if(actionName === 'SELL'){
      // console.log(this.getBidQuantity(), this.getTotalQuantity(this.buys))
      // if(this.getTotalQuantity(this.buys) === NaN){
      //   console.log(this.buys)
      // }
      // if(this.getBidQuantity() === NaN){
      //   console.log(this.buys)
      // }
      if(this.holdQuantity === 0) return 0;
      return Math.min(this.getBidQuantity(), this.holdQuantity);
    }
    if(actionName === 'HODL'){
      return 0;
    }
    if(actionName === 'CLEAR'){
      return this.getTotalQuantity(this.buys) - this.getTotalQuantity(this.sells);
    }
  }

  getTradePrice(actionName) {
    if(actionName === 'BUY'){
      return this.getAskPrice();
    }
    if(actionName === 'SELL'){
      return this.getBidPrice();
    }
  }

  getStepReward(actionName, quantity) {
    // return Math.random()*10;
    if(actionName === 'BUY'){
      // last VWAP = 500
      // new price = 400
      // return amount underneath last VWAP
      // normalize
      return ((this.lastVWAP-this.getAskPrice())/this.lastVWAP);
    }
    if(actionName === 'SELL'){
      // last VWAP = 500
      // new price = 600
      // return amount over last VWAP
      // normalize
      console.log(((this.getBidPrice()-this.lastVWAP)/this.lastVWAP))
      return ((this.getBidPrice()-this.lastVWAP)/this.lastVWAP);
    }
    if(actionName === 'HODL'){
      return 0;
    }
    if(actionName === 'CLEAR'){
      return ((this.getBidPrice()-this.lastVWAP)/this.lastVWAP);
    }
  }

  calculateProfit() {
    // console.log(this.sells)
    const cost = this.getTotalPositionPrice(this.buys);
    const revenue = this.getTotalPositionPrice(this.sells);
    // console.log(this.buys)
    // console.log(this.sells)
    return revenue - cost;
  }

  setLastVWAP() {
    this.lastVWAP = this.getVWAP(this.buys);
  }

  getVWAP(positions) {
    const totalQuantity = this.getTotalQuantity(positions);
    const weightedPrices = positions.map(position => position.price*(position.quantity/totalQuantity));
    return weightedPrices.reduce((a,b) => a + b);
  }

  getTotalQuantity(positions) {
    // console.log('check in ttl qty')
    // console.log(positions)
    if(!positions || positions.length === 0) return 0;
    if(positions.length === 1) return positions[0].quantity;
    return positions.map(position => position.quantity).reduce((a,b) => a + b);
  }

  getTotalPositionPrice(positions) {
    if(!positions || positions.length === 0) return 0;
    if(positions.length === 1) return positions[0].quantity * positions[0].price;
    return positions.map(a => a.quantity * a.price).reduce((a,b) => a+b);
  }

  init(oneSideWidth) {
    this.actions = ONECOINACTIONS.map((action, index) => {
      return new Action(action, index);
    });

    // States
    for (let i = 0; i < BOOKCOMBINATIONS.length; i++) {
      for(let j = 0; j < BOOKCOMBINATIONS.length; j++) {
        const sells = BOOKCOMBINATIONS[j];
        const buys = BOOKCOMBINATIONS[i];
        const id = `${sells.join('')}${buys.join('')}`;
        this.states[id] = new State(id, sells, buys);
      }
    }


    for(let key in this.states){
      for (let j = 0; j < this.actions.length; j++) {
        // 0 = BUY
        // 1 = SELL
        // 2 = HODL
        // 3 = CLEAR
        // If the first order in the book is profitable, should you do it?
        this.addStateAction(key, 0, this.states[key].bidBook[0]);

        this.addStateAction(key, 1, this.states[key].askBook[0]);

        this.addStateAction(key, 2, 0);

        this.addStateAction(key, 3, 0);

      }
    }
  }
}

module.exports = ExchangeWorld;

// // room for expansion

// let actions go further than one step left of right
// let states take history into account
// parse prices further left and right of orderbook


// figure out hodl reward function
