const authedWebsocket = require('./authedWebSocket.js');
const publicWebsocket = require('./publicWebSocket.js');
const Inventory = require('./Inventory.js');
const StateChecks = require('./StateChecks.js');
const ActionChecks = require('./ActionChecks.js');
const MarketPrices = require('./MarketPrices.js');
const AuthorizedSocketHandler = require('./AuthorizedSocketHandler.js');
const PublicSocketHandler = require('./PublicSocketHandler.js');

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

const inventory = new Inventory();
const prices = new MarketPrices();
const actionChecks = new ActionChecks(inventory, prices);
const authorizedSocketHandler = new AuthorizedSocketHandler(inventory, MarketPrices, StateChecks);
const publicSocketHandler = new PublicSocketHandler(inventory, MarketPrices, StateChecks);

authedWebsocket.on('message', this.authorizedSocketHandler.handleAuthorizedMessage);
authedWebsocket.on('error', err => {
  console.log(err.data)
});

publicWebsocket.on('message', this.publicSocketHandler.handleAuthorizedMessage);
publicWebsocket.on('error', err => {
  console.log(err.data)
});
