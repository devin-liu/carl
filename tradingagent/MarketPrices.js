const TransactionParser = require('./TransactionParser.js');
// original Problems we are trying to solve
// 1. Can't keep track of ethereum wallet
// 2. Orderbook responses don't send back original order

class MarketPrices extends TransactionParser {
  constructor() {
    super();
    this.asks = null; // market WTS & higher price
    this.bids = null; // market WTB & lower price
    this.spread = null;
    // this.lastAsk = null;
    // this.lastBid = null;
  }

  getFirstBidPrice() {
    return this.parseOrderPrice(this.bids[0]);
  }

  getFirstAskPrice() {
    return this.parseOrderPrice(this.asks[0]);
  }

  getFirstBidSize() {
    return this.parseOrderSize(this.bids[0]);
  }

  getFirstAskSize() {
    return this.parseOrderSize(this.asks[0]);
  }

  getFirstAskCost() {
    return this.getFirstAskSize() * this.getFirstAskPrice();
  }

  getFirstBidCost() {
    return this.getFirstBidSize() * this.getFirstBidPrice();
  }

  avgBidPrice() {
    return this.calculateAvgBookPrice(this.bids);
  }

  avgAskPrice() {
    return this.calculateAvgBookPrice(this.asks);
  }

  updateOrderBook(orderBook) {
    const { asks, bids } = orderBook;
    this.asks = asks;
    this.bids = bids;
  }

  updateTicker({best_ask, best_bid, spread}) {
    this.best_ask = best_ask;
    this.best_bid = best_bid;
    this.spread = spread;
  }
}

module.exports = MarketPrices;
