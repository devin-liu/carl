const TransactionParser = require('./TransactionParser.js');
// original Problems we are trying to solve
// 1. Can't keep track of ethereum wallet
// 2. Orderbook responses don't send back original order

class MarketPrices extends TransactionParser {
  constructor() {
    super();
    this.asks = null;
    this.bids = null;
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

  avgBookPrice(arr) {
    return arr.map()
  }

  updateOrderBook(orderBook) {
    const { asks, bids } = orderBook;
    this.asks = asks;
    this.bids = bids;
  }
}
