// 0 = < VWAP
// 1 = > VWAP

// exampleBuyBoard = [1,1,1,0,0]
// exampleSellBoard = [1,1,0,0,0]



// quantity = min(10% of account, order size)


// Step left(sell)
// Step Right(buy)



// add to position


class Position {
  constructor(symbol, price, quantity, id) {
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
    this.id = id;
  }
}


class Agent {
  constructor(symbol) {
    this.buys = [];
    this.sells = [];
    this.lastVWAP = 0;
    this.profit = 0;
  }


  getTotalQuantity(positions) {
    return positions.reduce((a,b) => a.quantity + b.quantity);
  }

  getTotalPositionPrice(positions) {
    return positions.reduce((a,b) => a.quantity * a.price + b.quantity * b.price)
  }

  getVWAP(positions) {
    const totalAmount = this.getTotalQuantity(positions);
    const quantitys = positions.map(position => position.price*(position.quantity/totalAmount));
    return quantitys.reduce((a,b) => a + b);
  }

  buy(price, quantity) {
    this.buys.push(new Position(this.symbol, price, quantity));
  }

  sell(price, quantity) {
    this.sells.push(new Position(this.symbol, price, quantity));
  }

  clearBalance() {
    this.buys = [];
    this.sells = [];
  }

  calculateProfit() {
    const cost = this.getTotalPositionPrice(this.buys);
    const revenue = this.getTotalPositionPrice(this.sells);
    return revenue - cost;
  }

  setLastVWAP() {
    this.lastVWAP = this.getVWAP(this.buys);
  }

}



// Q network architecture


// atari example
// -> 84x84x4
// -> 16 8x8 stride 4
// -> 32 4x4 stride 2
// -> fc 256
// -> fc-4 (4 actions)

// current State S = 10x1x10 stack of last 10 orderbooks

// avoid training from batches of consecutive samples
// use experience replay
