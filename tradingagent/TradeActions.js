const authedClient = require('./authedClient.js');

class TradeActions {
  constructor(product_id, Inventory) {
    this.size = .01;
    this.product_id = product_id;
    this.Inventory = Inventory;
  }

  handleResponse(error, response, data) => {
    if(error){
      console.log(error)
    }
    // console.log(data)
    console.log(`Cash 2: ${this.Inventory.cash} @ ${time}`)
    console.log(`ETH 2: ${this.Inventory.getTotalPosition()} @ ${time}`)
  }

  buy(price) {
    console.log('buying more shares')
    this.Inventory.spendCash(parseFloat(price)*size);
    const { size, product_id } = this;
    authedClient.buy({
      price,
      size,
      product_id,
    }, this.handleResponse);
  }

  sell(price) {
    console.log('selling more shares')
    const { size, product_id } = this;
    authedClient.sell({
      price,
      size,
      product_id,
    }, this.handleResponse);
  }

}
