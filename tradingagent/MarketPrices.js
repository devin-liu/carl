// original Problems we are trying to solve
// 1. Can't keep track of ethereum wallet
// 2. Orderbook responses don't send back original order

class MarketPrices {
  constructor() {
    this.asks = null;
    this.bids = null;
  }

  getFirstBidPrice() {
    return parseFloat(this.bids[0][0]);
  }

  getFirstAskPrice() {
    return parseFloat(this.asks[0][0]);
  }

  getFirstBidSize() {
    return parseFloat(this.bids[0][1]);
  }

  getFirstAskSize() {
    return parseFloat(this.asks[0][1]);
  }

  updateOrderBook(orderBook) {
    const { asks, bids } = orderBook;
    this.asks = asks;
    this.bids = bids;
  }
}

