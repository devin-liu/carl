// get info
  // order comes in from websocket
// parse info
  // check if order filled
  //
// do accounting
// get new transition state
// tell state machine to transition
// take actions
  // add to pending orders
// wait for more information

const Inventory = require('./Inventory.js');
const StateMachine = require('javascript-state-machine');
const fsm = new StateMachine({
  init: 'init',
  transitions: [
    { name: 'increaseFromInit',     from: 'init',  to: 'increase' },
    // Our agent starts with zero inventory I = 0 in the Init state
    // by joining the top of the market’s best bid and ask in size S.
    // Assume the agent has executed part of his bid, and now carries
    // positive inventory I > 0. It transitions to the AccumulateLong state where 0 < I < S < K,
    { name: 'reduceFromIncrease',   from: 'increase', to: 'reduce'  },
    { name: 'increaseFromReduce',   from: 'reduce', to: 'increase'  },
    // ReduceLong state, where it would quote a bid below the top bid,
    // and offer I at least at the market offer or more ag- gressively (if possible).
    // It becomes a more aggressive seller,
    // and if it suddenly detects that more trades are happening at the previous bid,
    // then it would attempt to altogether scratch the trade and hit the bid with size I.
    { name: 'stopFromReduce', from: 'reduce', to: 'stop'    },
    { name: 'stopFromIncrease', from: 'increase', to: 'stop'    },
    { name: 'initFromStop', from: 'stop', to: 'init'    },
  ],
  methods: {
    onIncreaseFromInit,
    onReduceFromIncrease,
    onIncreaseFromReduce,
    onStopFromIncrease,
    onStopFromReduce,
    onInitFromStop
  }
});



// Actions:
// create more buy orders
// if (state === 'init') {
// }

// // Actions:
// // create more buy orders
// // reduce sell orders
// if (state === 'increase') {

// }

// // Actions:
// // cancel buy orders
// // create more sell orders
// if (state === 'reduce') {

// }

// // Actions:
// // Remove all market positions
// // cancel all buy orders
// // sell all positions
// if (state === 'stop') {

// }

// Initial
// I = 0
// TransitionTo
// 0 < I < S
// Exits:
// Reduce position
function onIncreaseFromInit() {
  console.log('entering market');
}

// Initial
// 0 < I < S
// TransitionTo
// S <= I < K
// Exits:
// Increase
// Stop
function onReduceFromIncrease() {
  console.log('selling shares');
}

// Initial
// S <= I < K
// TransitionTo
// 0 < I < S
// Exits:
// Reduce position
function onIncreaseFromReduce() {
  console.log('buying shares');
}

// Initial
// S <= I < K
// TransitionTo
// I >= K
// Exits:
// Init
function onStopFromReduce() {
  console.log('getting out of market');
}

// Initial
// 0 < I < S
// TransitionTo
// I >= K
// Exits:
// Init
function onStopFromIncrease() {
  console.log('getting out of market');
}

// Initial
// I >= K
// TransitionTo
// I = 0
// Exits:
// Increase
function onInitFromStop() {
  console.log('starting again');
}

fsm.increaseFromInit();
fsm.reduceFromIncrease();
fsm.increaseFromReduce();
fsm.reduceFromIncrease();
fsm.stopFromReduce();
fsm.initFromStop();


// The level2 channel
// {
//     "type": "snapshot",
//     "product_id": "USD-ETH",
//     "bids": [["1", "2"]], //   [price, size]
//     "asks": [["2", "3"]]
// }

class StateChecks {
  constructor(inventory) {
    this.inventory = inventory;
  }

  getInventorySize() {
    return this.inventory.getTotalPosition();
  }

  // check if inventory is empty
  isEmpty(){
    return this.getInventorySize() === 0;
  }

  // check if current inventory is above size S(best ask size)
  overSpread(snapshot) {
    return this.getInventorySize() > snapshot.asks[0][1];
  }

  // check if current inventory is above market size
  overMarket(snapshot) {
    const bidSizes = snapshot.bids.map(bid => bid[1]);
    const marketSize = this.Inventory.calculateArrayTotal(bidSizes);
    return this.getInventorySize() > marketSize;
  }
}


const ethPositions = new Inventory();
const marketState = new StateChecks();

// const websocket = require('./authedWebSocket.js');

// websocket.on('message', data => {
//   console.log(data)
// });



// websocket.subscribe({ product_ids: ['LTC-USD'], channels: ['ticker', 'user'] });


// current Bid buckets
// current Ask Buckets

// trade in there that matched? -> 0 / 1


// OK pricing model!!!

// Inventory Model?

// init
// accumulate long (0 < inventory < size < K?)
// reduce long


// {
//     "type": "ticker",
//     "trade_id": 20153558,
//     "sequence": 3262786978,
//     "time": "2017-09-02T17:05:49.250000Z",
//     "product_id": "BTC-USD",
//     "price": "4388.01000000",
//     "side": "buy", // Taker side
//     "last_size": "0.03000000",
//     "best_bid": "4388",
//     "best_ask": "4388.01"
// }


// control (limit) size of inventory
// compare average price (based on what?)
// accumulate or reduce position (based on what?)


