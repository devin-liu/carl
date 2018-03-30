const DB = require('../datafeed/Database/index.js');

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
  agent.step(thisStepState)
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
      if(pages[i].data)stepAgentForward(pages[i].data);
    }
    return resolve();
  })
}


function train(steps=10000, page_size=10, repeat=2, pair_string='ETH-USD') {

  reset();
  world.policy = agent.policy();

  for(let i = 0; i < repeat; i++){
    for(let page = 0; page < steps / page_size; page++){
      getBatch(page_size, page, pair_string)
      .then(stepThroughPages)
    }
  }


}


function reset() {
  world.reset();
  agent.reset();
}

getBatch(1,0,pair_string)
.then((response) => {
  world.firstVWAP = response[0].data.asks[0][0];
  train(300000, 1000)
})
// world.start()
