const TransactionParser = require('./TransactionParser.js');

class Inventory extends TransactionParser {

  constructor() {
    super();
    this.buys = [];
    this.sells = [];
    this.pendingOrders = {};
    this.total = 0;
    this.cash = 7.51;
  }

  spendCash(cash){
    this.cash -= cash;
  }

  addCash(cash){
    this.cash += cash;
  }

  setCash(cash){
    this.cash = cash;
  }

  addPendingOrder(order) {
    if(!order || !order.order_id) return;
    this.pendingOrders[order.order_id] = order;
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

  getPositionSizes(positions) {
    return positions.map(pos => parseFloat(pos.size));
  }

  getPositionValues(positions) {
    return positions.map(pos => parseFloat(pos.price) * parseFloat(pos.size));
  }

  getTotalPosition() {
    const sells = this.getPositionSizes(this.sells);
    const holds = this.getPositionSizes(this.buys);
    return this.calculateNetValue(holds, sells);
  }

  getTotalProfit() {
    const cost = this.getPositionValues(this.buys);
    const revenue = this.getPositionValues(this.sells);
    return this.calculateNetValue(revenue, cost);
  }

}

module.exports = Inventory;
