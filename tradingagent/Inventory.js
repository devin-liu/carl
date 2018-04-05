class Inventory {

  constructor() {
    this.buys = [];
    this.sells = [];
    this.pendingOrders = {};
    this.total = 0;
  }

  addPendingOrder(order) {
    if(!order || !order.order_id) return;
    this.pendingOrders[order.order_id] = true;
  }

  removePendingOrder(order) {
    if(!order || !order.order_id) return;
    delete this.pendingOrders[order.order_id];
  }

  isPendingOrder(order) {
    return order && this.pendingOrders[order.order_id];
  }

  addBuyPosition(position) {
    this.buys.push(position);
  }

  addSellPosition(position) {
    this.sells.push(position);
  }

  getPositionQuantities(positions) {
    return positions.map(pos => pos.quantity);
  }

  getPositionValues(positions) {
    return positions.map(pos => pos.price * pos.quantity);
  }

  getTotalPosition() {
    const sells = this.getPositionQuantities(this.sells);
    const holds = this.getPositionQuantities(this.buys);
    return this.calculateNetValue(holds, sells);
  }

  getTotalProfit() {
    const cost = this.getPositionValues(this.buys);
    const revenue = this.getPositionValues(this.sells);
    return this.calculateNetValue(revenue, cost);
  }

  //  receives list of two integers and subtracts the second from the first
  calculateNetValue(listA, listB) {
    const totalA = this.calculateArrayTotal(listA);
    const totalB = this.calculateArrayTotal(listB);
    return totalA - totalB;
  }

  // Receives array of numbers
  calculateArrayTotal(arr) {
    if(arr.length === 0) {
      return 0;
    }
    if(arr.length === 1) {
      return arr[0];
    }
    return arr.reduce((a,b) => a + b);
  }

}

module.exports = Inventory;