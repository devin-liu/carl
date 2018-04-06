const authedWebsocket = require('./authedWebSocket.js');
const publicWebsocket = require('./publicWebSocket.js');
const authedClient = require('./authedClient.js');
const Inventory = require('./Inventory.js');
const StateChecks = require('./StateChecks.js');
const MarketPrices = require('./MarketPrices.js');
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

let ask = null;
let bid = null;
let spread = null;
const size = .01;

function handleTicker(ticker) {
  // console.log(ticker)
  if(!ticker.time) return;
  // ask = WTS (higher price)
  // bid = WTB
  const { best_ask, best_bid, product_id, time } = ticker;
  ask = parseFloat(best_ask);
  bid = parseFloat(best_bid);
  spread = ask - bid;
}

function handleHeartbeat(heartbeat) {
  if(!ask || !bid) return;
  const { product_id, time } = heartbeat;
  const canBuy = ethPositions.cash - (size*bid) > 0;
  const canSell = ethPositions.getTotalPosition() >= .01;
  if(fsm.state === 'increase' && !canBuy){
    fsm.reduceFromIncrease();
  }
  if(fsm.state === 'decrease' && !canSell){
    fsm.increaseFromReduce();
  }
  console.log(`Cash 1: ${ethPositions.cash} @ ${time}`)
  console.log(`ETH 1: ${ethPositions.getTotalPosition()} @ ${time}`)
  if(fsm.state === 'increase' && canBuy){
    // const price = (bid + spread*.1).toFixed(2);
    const price = ask;
    console.log('buying more shares')
    authedClient.buy({
      price,
      size,
      product_id,
    }, (error, response, data) => {
      if(error){
        console.log(error)
      }
      // console.log(data)
    })
    ethPositions.spendCash(parseFloat(price)*size);
  }
  if(fsm.state === 'reduce' && canSell){
  // if(fsm.state === 'reduce'){
    // const price = (ask - spread*.1).toFixed(2);
    console.log('selling more shares')
    const price = bid;
    authedClient.sell({
      price,
      size,
      product_id,
    }, (error, response, data) => {
      if(error){
        console.log(error.data)
      }
      // console.log(data)
    })
  }
  console.log(`Cash 2: ${ethPositions.cash} @ ${time}`)
  console.log(`ETH 2: ${ethPositions.getTotalPosition()} @ ${time}`)
  // console.log(`Cash: ${ethPositions.cash}`)
}

function handleOpenOrder(order) {
  ethPositions.addPendingOrder(order);
}


// { type: 'done',
//   side: 'buy',
//   order_id: 'cb2f2db4-7fc7-405d-a839-5807f02e5589',
//   reason: 'filled',
//   product_id: 'ETH-USD',
//   price: '379.64000000',
//   remaining_size: '0.00000000',
//   sequence: 3247430598,
//   user_id: '56134d7dd656900f34000310',
//   profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
//   time: '2018-04-06T02:23:10.707000Z' }
function handleDoneOrder(order) {
  const { price } = order;
  if(order.side === "sell"){
    ethPositions.addSellPosition(Object.assign({},order,{size:.01}));
    // let fill_fees = order.fill_fees ? 0 : parseFloat(order.fill_fees);
    if(!price || !size) return;
    ethPositions.addCash(parseFloat(price)*parseFloat(size));
  }
  if(order.side === "buy"){
    ethPositions.addBuyPosition(Object.assign({},order,{size:.01}));
  }
}

// { type: 'match',
//   trade_id: 31735110,
//   maker_order_id: '2f8ddc3c-5444-46f2-8166-9e5e18f99204',
//   taker_order_id: 'cb2f2db4-7fc7-405d-a839-5807f02e5589',
//   side: 'sell',
//   size: '0.01000000',
//   price: '379.64000000',
//   product_id: 'ETH-USD',
//   taker_user_id: '56134d7dd656900f34000310',
//   user_id: '56134d7dd656900f34000310',
//   taker_profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
//   profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
//   sequence: 3247430597,
//   time: '2018-04-06T02:23:10.707000Z' }
function handleMatchOrder(order) {
  const { price } = order;
  if(!price || !size) return;
  if(order.side === "sell"){
    ethPositions.addSellPosition(Object.assign({},order,{size:.01}));
    // let fill_fees = order.fill_fees ? 0 : parseFloat(order.fill_fees);
    ethPositions.addCash(parseFloat(price)*parseFloat(size));
  }
  if(order.side === "buy"){
    ethPositions.addBuyPosition(Object.assign({},order,{size:.01}));
  }
}


const ethPositions = new Inventory();
const agentState = new StateChecks(ethPositions);
const prices = new MarketPrices();


authedWebsocket.on('message', data => {
  console.log(data)
  if(data.type === "open"){
    handleOpenOrder(data)
  }
  if(data.type === "done"){
    handleDoneOrder(data)
  }

  if(data.type === "match"){
    handleMatchOrder(data)
  }
});

authedWebsocket.on('error', err => {
  console.log(err.data)
});


publicWebsocket.on('message', data => {
  if(data.type === "snapshot"){
    handleSnapshot(data)
    MarketPrices.updateOrderBook(data);
  }
  if(data.type === "ticker"){
    handleTicker(data)
  }

  if(data.type === "heartbeat"){
    handleHeartbeat(data)
  }
});

publicWebsocket.on('error', err => {
  console.log(err.data)
});
