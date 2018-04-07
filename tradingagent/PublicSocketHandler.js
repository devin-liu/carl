class PublicSocketHandler {
  constructor(Inventory, MarketPrices, StateChecks){
    this.Inventory = Inventory;
    this.MarketPrices = MarketPrices;
    this.ActionChecks = ActionChecks;
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
