const DB = require('../datafeed/Database/index.js');
const Promise = require("bluebird");


const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');


const world = new ExchangeWorld(5, 'ETH-USD', null, {});
const agent = new QLearner(world);
const pair_string = 'ETH-USD';


function stepAgentForward(orderBook) {
  const { marketBids, marketAsks, stateId } = world.parseOrderBook(orderBook);
  const thisStepState = world.states[stateId];
  agent.currentState = orderBook;
  world.setOrderBook({ marketAsks, marketBids });
  return agent.step(thisStepState)
}


function getBatch(items, page, pair_string) {
  return new Promise((resolve, reject) => {
    DB.query(`select * from orderbook where pair_string LIKE '${pair_string}' limit ${items} offset ${1+items*page};`, (error, response) => {
      if(error){
        reject(error);
      }
      return resolve(response.rows);
    })
  })
}

function stepThroughPages(pages) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < pages.length; i++){
      let thisStep = stepAgentForward(pages[i].data);
      if(i === pages.length-1) resolve(thisStep);
    }
  })
}


function train(steps=10000, page_size=10, repeat=2, pair_string='ETH-USD') {

  reset();
  world.policy = agent.policy();

  let epochPromises = [];

  for(let i = 0; i < repeat; i++){
    let newEpoch = new Promise(resolveEpoch => {
      for(let page = 0; page < steps / page_size; page++){
        let batchArray = [];
        batchArray.push(new Promise((resolveBatch) => {
          getBatch(page_size, page, pair_string)
          .then(stepThroughPages)
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


function reset() {
  world.reset();
  agent.reset();
}

getBatch(1,0,pair_string)
.then((response) => {
  world.firstVWAP = response[0].data.asks[0][0];
  // train(300000, 1000, 10)
  train(140000, 1000, 10)
  return Promise.resolve()
})
// .then(() => {
//   train(460000, 1000, 100)
// })
// world.start()

module.exports = train;
