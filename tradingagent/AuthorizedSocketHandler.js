class AuthorizedSocketHandler {
  constructor(Inventory, MarketPrices, StateChecks){
    this.Inventory = Inventory;
    this.MarketPrices = MarketPrices;
    this.ActionChecks = ActionChecks;
  }

  handleOpenOrder(order) => {
    this.Inventory.addPendingOrder(order);
  }

  handleDoneOrder(order) {
    const { price } = order;
    if(order.side === "sell"){
      this.Inventory.addSellPosition(Object.assign({},order,{size:.01}));
      if(!price || !size) return;
      this.Inventory.addCash(parseFloat(price)*parseFloat(size));
    }
    if(order.side === "buy"){
      this.Inventory.addBuyPosition(Object.assign({},order,{size:.01}));
    }
  }

  handleMatchOrder(order) {
    const { price } = order;
    if(!price || !size) return;
    if(order.side === "sell"){
      this.Inventory.addSellPosition(Object.assign({},order,{size:.01}));
      this.Inventory.addCash(parseFloat(price)*parseFloat(size));
    }
    if(order.side === "buy"){
      this.Inventory.addBuyPosition(Object.assign({},order,{size:.01}));
    }
  }

  handleAuthorizedMessage(data) => {
    console.log(data)
    if(data.type === "open"){
      this.handleOpenOrder(data);
    }
    if(data.type === "done"){
      this.handleDoneOrder(data);
    }

    if(data.type === "match"){
      this.handleMatchOrder(data);
    }
  }
}

module.exports = AuthorizedSocketHandler;
