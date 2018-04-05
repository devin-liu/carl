const authedWebsocket = require('./authedWebSocket.js');
const publicWebsocket = require('./publicWebSocket.js');
const authedClient = require('./authedClient.js');
const Inventory = require('./Inventory.js');
const StateChecks = require('./StateChecks.js');
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
// Stop
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


// The level2 channel
// {
//     "type": "snapshot",
//     "product_id": "USD-ETH",
//     "bids": [["1", "2"]], //   [price, size]
//     "asks": [["2", "3"]]
// }

function handleSnapshot(snapshot) {
  // Actions:
  // create more buy orders
  if (fsm.state === 'init') {
    if(agentState.isEmpty()) return fsm.increaseFromInit();
  }

  // // Actions:
  // // create more buy orders
  // // reduce sell orders
  if (fsm.state === 'increase') {
    if(agentState.overMarket()) return fsm.stopFromIncrease();
    if(agentState.overWallet()) return fsm.reduceFromIncrease();
    if(agentState.overSpread()) return fsm.reduceFromIncrease();
  }

  // // Actions:
  // // cancel buy orders
  // // create more sell orders
  if (fsm.state === 'reduce') {
    if(agentState.overMarket()) return fsm.stopFromReduce();
    if(agentState.overWallet()) return;
    if(!agentState.overSpread()) return fsm.increaseFromReduce();
  }

  // // Actions:
  // // Remove all market positions
  // // cancel all buy orders
  // // sell all positions
  if (fsm.state === 'stop') {
    if(agentState.isEmpty()) return fsm.initFromStop();
  }
}

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
function handleTicker(ticker) {
  // ask = WTS (higher price)
  // bid = WTB
  const { best_ask, best_bid, product_id } = ticker;
  const ask = parseFloat(best_ask);
  const bid = parseFloat(best_bid);
  const spread = ask - bid;
  const size = .01;
  const canBuy = ethPositions.cash - (size*bid)
  if(fsm.state === 'increase' && !canBuy){
    fsm.reduceFromIncrease();
  }
  if(fsm.state === 'increase' && canBuy){
    const price = (bid + spread*.1).toFixed(2);
    authedClient.buy({
      side: 'buy',
      price,
      size,
      product_id,
    }, (error, response, data) => {
      if(error){
        console.log(error)
      }
      console.log(data)
    })
    ethPositions.spendCash(parseFloat(price)*parseFloat(size));
  }
  if(fsm.state === 'reduce'){
    const price = (ask - spread*.1).toFixed(2);
    authedClient.buy({
      side: 'sell',
      price: ask,
      size,
      product_id,
    }, (error, response, data) => {
      if(error){
        console.log(error)
      }
      console.log(data)
    })
  }
  console.log(`Cash: ${ethPositions.cash}`)
  // console.log(`Cash: ${ethPositions.cash}`)
}

function handleOpenOrder(order) {
  ethPositions.addPendingOrder(order);
}

function handleDoneOrder(order) {
  if(order.side === "sell"){
    ethPositions.addSellPosition(order);
    let fill_fees = order.fill_fees ? 0 : parseFloat(order.fill_fees);
    ethPositions.addCash(parseFloat(price)*parseFloat(size) - fill_fees);
  }
  if(order.side === "buy"){
    ethPositions.addBuyPosition(order);
  }
}

const ethPositions = new Inventory();
const agentState = new StateChecks(ethPositions);


authedWebsocket.on('message', data => {
  if(data.type === "open"){
    handleOpenOrder(data)
  }
  if(data.type === "done"){
    handleDoneOrder(data)
  }
});

authedWebsocket.on('error', err => {
  console.log(err)
});


publicWebsocket.on('message', data => {
  if(data.type === "snapshot"){
    handleSnapshot(data)
  }
  if(data.type === "ticker"){
    handleTicker(data)
  }
});

publicWebsocket.on('error', err => {
  console.log(err)
});
