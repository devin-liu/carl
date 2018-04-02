const DB = require('../datafeed/Database/index.js');
const Promise = require("bluebird");

class Trainer {
  constructor(agent, world, symbol) {
    this.agent = agent;
    this.world = world;
    this.symbol = symbol;
    this.train = this.train.bind(this);
    this.stepThroughPages = this.stepThroughPages.bind(this);
  }


  // setNewWorldOrderBook({ orderBook, marketAsks, marketBids }) {
  //   this.agent.currentState = orderBook;
  //   this.world.setOrderBook({ marketAsks, marketBids });
  // }

  getNewStepState(stateId) {
    return this.world.states[stateId];
  }

  stepAgentForward(orderBook) {
    const { marketBids, marketAsks, stateId } = this.world.parseOrderBook(orderBook);
    // this.setNewWorldOrderBook({orderBook, marketAsks, marketBids});
    this.world.setOrderBook({ marketAsks, marketBids });
    const thisStepState = this.getNewStepState(stateId);
    return this.agent.step(thisStepState)
  }

  getBatch(items, page, pair_string) {
    return new Promise((resolve, reject) => {
      DB.query(`select * from orderbook where pair_string LIKE '${pair_string}' limit ${items} offset ${1+items*page};`, (error, response) => {
        if(error){
          reject(error);
        }
        return resolve(response.rows);
      })
    })
  }

  stepThroughPages(pages) {
    return new Promise((resolve, reject) => {
      for(let i = 0; i < pages.length; i++){
        let thisStep = this.stepAgentForward(pages[i].data);
        if(i === pages.length-1) resolve(thisStep);
      }
    })
  }

  reset(epoch=false) {
    this.world.reset();
    if (!epoch) this.agent.reset();
  }

  train(steps=10000, page_size=10, repeat=2, pair_string='ETH-USD') {
    this.world.policy = this.agent.policy();

    let epochPromises = [];

    for(let i = 0; i < repeat; i++){
      this.reset(i > 0);
      let newEpoch = new Promise(resolveEpoch => {
        for(let page = 0; page < steps / page_size; page++){
          let batchArray = [];
          batchArray.push(new Promise((resolveBatch) => {
            this.getBatch(page_size, page, pair_string)
            .then(this.stepThroughPages)
            .then(step => resolveBatch(step))
          }))
          Promise.all(batchArray).then((stepData) => {
            const currentAgent = stepData[stepData.length-1];
            const currentWorld = currentAgent.world;
            const profit = currentWorld.calculateProfit();
            console.log(`Epoch: ${i+1}/${repeat} ${parseInt(100*(page/(steps/page_size)))}% complete | Profit: ${profit}`)
            resolveEpoch({currentWorld,currentAgent,profit})
          })
        }
      })
      epochPromises.push(newEpoch);
    }


    Promise.all(epochPromises)
    .then(epochs => {
      epochs.map(epoch => {
        const { profit } = epoch;
        console.log(profit)
        console.log('Training Complete');
        const qs = `INSERT INTO qmap (data, pair_string, profit) values ('${JSON.stringify(epoch)}', '${pair_string}', ${profit});`;
        DB.query(qs);
      })
    })
  }

  init(steps=10000, page_size=10, repeat=2) {
    this.getBatch(1,0,this.symbol)
    .then((response) => {
      this.world.firstVWAP = response[0].data.asks[0][0];
      this.train(steps, page_size, repeat)
    })
  }

}

module.exports = Trainer;
