// 0 = < VWAP
// 1 = > VWAP

// exampleBuyBoard = [1,1,1,0,0]
// exampleSellBoard = [1,1,0,0,0]



// amount = min(10% of account, order size)


// Step left(sell)
// Step Right(buy)



// add to position


class Position {
  constructor(symbol, price, amount, id) {
    this.symbol = symbol;
    this.price = price;
    this.amount = amount;
    this.id = id;
  }
}


class Agent {
  constructor(symbol) {
    this.positions = [];
    this.lastVWAP = 0;
  }


  getVWAP() {
    const totalAmount = this.positions.map(position => position.amount);
    return this.positions.map(position => position.price*(position.amount/totalAmount));
  }

  buy(price, amount) {
    this.positions.push(new Position(this.symbol, price, amount))
  }

  sell() {
    this.lastVWAP = this.getVWAP(this.positions);
    this.positions = [];
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
