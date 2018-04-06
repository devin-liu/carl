class ActionChecks {
  constructor(Inventory, MarketPrices) {
    this.Inventory = Inventory;
    this.MarketPrices = MarketPrices;
  }

  canBuy() {
    if(!this.MarketPrices.asks || !this.MarketPrices.bids) return false;
    const myCash = this.Inventory.cash;
    const marketAsk = this.MarketPrices.getFirstAskPrice*.01;
    return myCash > marketAsk;
  }

  canSell() {
    if(!this.MarketPrices.asks || !this.MarketPrices.bids) return false;
    return this.Inventory.getTotalPosition() >= .01;
  }
}

module.exports = ActionChecks;
