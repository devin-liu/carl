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


const MIN_TRADE = {
  'ETH-USD' : .01,
  'LTC-USD' : .1
}

class ExchangeWorld extends StateMachine {
  constructor(oneSideWidth, symbol, firstVWAP) {
    super();
    this.reset();
    this.init(oneSideWidth);
    this.symbol = symbol
    this.firstVWAP = firstVWAP;
    this.minTrade = MIN_TRADE[symbol];
  }

  reset() {
    this.currentState = null;
    this.totalSteps = 1;
    this._running = false;
    this.policy = null;
    this.lastVWAP = this.firstVWAP;
    this.profit = 0;
    this.buys = [];
    this.sells = [];
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
      console.log(`${this.currentState.id} ${actionName}`)
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
      const qty = Math.min((maxRiskCash / price), this.getAskQuantity());
      return qty < this.minTrade ? this.minTrade : qty;
    }
    if(actionName === 'SELL'){
      if(this.holdQuantity === 0) return 0;
      const qty = Math.min(this.getBidQuantity(), this.holdQuantity);
      return qty < this.minTrade ? this.minTrade : qty;
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
    return this.profit+(revenue - cost);
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
      const combination = BOOKCOMBINATIONS[i];
      const sells = combination.sells;
      const buys = combination.buys;
      const id = `${sells.join('')}${buys.join('')}`;
      this.states[id] = new State(id, sells, buys);
    }

    for(let stateId in this.states){

      const combination = this.states[stateId]
      // 0 = BUY
      // 1 = SELL
      // 2 = HODL
      // 3 = CLEAR
      // If the first order in the book is profitable, should you do it?
      this.addStateAction(stateId, 0, 0);

      this.addStateAction(stateId, 1, 0);

      this.addStateAction(stateId, 2, 0.1);

      // this.addStateAction(stateId, 3, 0);

    }
  }
}

module.exports = ExchangeWorld;

// // room for expansion

// let actions go further than one step left of right
// let states take history into account
// parse prices further left and right of orderbook


// figure out hodl reward function


// OK so the only real states are:

// "1000000000"
// "1100000000"
// "1110000000"
// "1111000000"
// "1111100000"
// "0000000000"
// "0000010000"
// "0000011000"
// "0000011100"
// "0000011110"
// "0000011111"
