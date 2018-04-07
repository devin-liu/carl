class PublicSocketHandler {
  constructor(Inventory, MarketPrices, StateChecks){
    this.Inventory = Inventory;
    this.MarketPrices = MarketPrices;
    this.ActionChecks = ActionChecks;
  }

  handleSnapshot(snapshot) {
    this.MarketPrices.updateOrderBook(snapshot);
  }

  handleTicker(ticker) {
    if(!ticker.time) return;
    this.MarketPrices.updateTicker(ticker);
  }

  handleHeartbeat(heartbeat) {
    const { product_id, time } = heartbeat;
    const canBuy = this.ActionChecks.canBuy();
    const canSell = this.ActionChecks.canSell();
    if(canBuy){
      const price = this.MarketPrices.getAvgBidPrice();
      tradeActions.buy(price);
    }
    if(canSell){
      const price = this.MarketPrices.getAvgAskPrice();
      tradeActions.sell(price);
    }
  }

  handlePublicMessage(data) => {
    if(data.type === "snapshot"){
      this.handleSnapshot(data)
    }
    if(data.type === "ticker"){
      this.handleTicker(data)
    }

    if(data.type === "heartbeat"){
      this.handleHeartbeat(data)
    }
  }
}

module.exports = PublicSocketHandler;
