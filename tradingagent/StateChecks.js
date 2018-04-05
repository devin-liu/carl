class StateChecks {
  constructor(inventory) {
    this.inventory = inventory;
  }

  getInventorySize() {
    return this.inventory.getTotalPosition();
  }

  // check if inventory is empty
  isEmpty(){
    return this.getInventorySize() === 0;
  }

  // check if current inventory is above size S(best ask size)
  overSpread(snapshot) {
    return this.getInventorySize() > snapshot.asks[0][1];
  }

  // check if current inventory is above market size
  overMarket(snapshot) {
    const bidSizes = snapshot.bids.map(bid => bid[1]);
    const marketSize = this.Inventory.calculateArrayTotal(bidSizes);
    return this.getInventorySize() > marketSize;
  }
}
