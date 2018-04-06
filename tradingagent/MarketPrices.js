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
    return this.getOrderPrice(this.bids[0]);
  }

  getFirstAskPrice() {
    return this.getOrderPrice(this.asks[0]);
  }

  getFirstBidSize() {
    return this.getOrderSize(this.bids[0]);
  }

  getFirstAskSize() {
    return this.getOrderSize(this.asks[0]);
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
