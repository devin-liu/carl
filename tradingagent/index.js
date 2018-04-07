const authedWebsocket = require('./authedWebSocket.js');
const publicWebsocket = require('./publicWebSocket.js');
const Inventory = require('./Inventory.js');
const StateChecks = require('./StateChecks.js');
const ActionChecks = require('./ActionChecks.js');
const MarketPrices = require('./MarketPrices.js');

function handleSnapshot(snapshot) {
  MarketPrices.updateOrderBook(snapshot);
}

function handleTicker(ticker) {
  if(!ticker.time) return;
  MarketPrices.updateTicker(ticker);
}

function handleHeartbeat(heartbeat) {
  const { product_id, time } = heartbeat;
  const canBuy = actionChecks.canBuy();
  const canSell = actionChecks.canSell();
  if(canBuy){
    const price = MarketPrices.getAvgBidPrice();
    tradeActions.buy(price);
  }
  if(canSell){
    const price = MarketPrices.getAvgAskPrice();
    tradeActions.sell(price);

  }
}

function handleOpenOrder(order) {
  inventory.addPendingOrder(order);
}

function handleDoneOrder(order) {
  const { price } = order;
  if(order.side === "sell"){
    inventory.addSellPosition(Object.assign({},order,{size:.01}));
    if(!price || !size) return;
    inventory.addCash(parseFloat(price)*parseFloat(size));
  }
  if(order.side === "buy"){
    inventory.addBuyPosition(Object.assign({},order,{size:.01}));
  }
}

function handleMatchOrder(order) {
  const { price } = order;
  if(!price || !size) return;
  if(order.side === "sell"){
    inventory.addSellPosition(Object.assign({},order,{size:.01}));
    inventory.addCash(parseFloat(price)*parseFloat(size));
  }
  if(order.side === "buy"){
    inventory.addBuyPosition(Object.assign({},order,{size:.01}));
  }
}


const inventory = new Inventory();
const prices = new MarketPrices();
const agentState = new StateChecks(inventory);
const actionChecks = new ActionChecks(inventory, prices);


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
