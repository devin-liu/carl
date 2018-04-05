// get info
// parse info
// do accounting
// get new transition state
// tell state machine to transition
// take actions
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
    { name: 'initFromStop', from: 'stop', to: 'init'    },
  ],
  methods: {
    onIncreaseFromInit:     function() { console.log('entering market')    },
    onReduceFromIncrease:   function() { console.log('selling shares')     },
    onIncreaseFromReduce:   function() { console.log('buying shares')     },
    onStopFromReduce:       function() { console.log('getting out of market') },
    onInitFromStop:         function() { console.log('starting again') }
  }
});


// Actions:
// create more buy orders
// reduce sell orders
// Exits:
// Reduce position
function onIncreaseFromInit() {

}

// Actions:
// cancel buy orders
// create more sell orders
// Exits:
// Increase
// Stop
function onReduceFromIncrease() {

}

// Actions:
// create more buy orders
// reduce sell orders
// Exits:
// Reduce position
function onIncreaseFromReduce() {

}

// Actions:
// Remove all market positions
// cancel all buy orders
// sell all positions
// Exits:
// Init
function onStopFromReduce() {

}

// Actions:
// Wait for movement to be over
// Exits:
// Increase
function onInitFromStop() {

}


fsm.increaseFromInit();
fsm.reduceFromIncrease();
fsm.increaseFromReduce();
fsm.reduceFromIncrease();
fsm.stopFromReduce();
fsm.initFromStop();

class AgentMetrics() {
  constructor(inventory) {
    this.inventory = inventory;
  }

  // 0 = init
  // 1 = increasing
  // 2 = decreasing
  // 3 = exit market
  overSized(tick) {
    const currentInventory = this.inventory.getTotalPosition();
    // make sure current inventory is less than size S(best ask size)
  }
}


const ethPocket = new Inventory();
const marketState = new AgentMetrics();

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


