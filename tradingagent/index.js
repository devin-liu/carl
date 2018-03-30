const DB = require('../datafeed/Database/index.js');

const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');


const world = new ExchangeWorld(5, 'ETH-USD', 300, {});
const agent = new QLearner(world);


function stepAgentForward(orderBook) {
  const { marketBids, marketAsks, stateId } = world.parseOrderBook(orderBook);
  const thisStepState = world.states[stateId];
  agent.currentState = orderBook;
  world.setOrderBook({ marketAsks, marketBids });
  agent.step(thisStepState)
}


function getBatch(items, page, pair_string) {
  return new Promise((resolve, reject) => {
    DB.query(`select * from orderbook where pair_string LIKE '${pair_string}' limit ${items} offset ${items*page};`, (error, response) => {
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
  return new Promise((resolve, reject) => {
    world.policy = agent.policy();
    reset();

    // while(this.page*page_size < steps){

    // }
    for(let page = 0; page < steps / page_size; page++){
      getBatch(page_size, page, pair_string)
      .then(stepThroughPages)
      // console.log(`Page: ${page}`)
      // console.log(`Holding: ${world.holdQuantity}`)
      console.log(`${world.lastVWAP}`)
      console.log(`Profit: ${world.calculateProfit()}`)
    }
    resolve(world)
  })

}


function reset() {
  world.reset();
  agent.reset();
}


// world.start()
train(300000, 1000)
.then(world => {
  console.log(`Holding: ${world.holdQuantity}`)
  console.log(`Profit: ${world.calculateProfit()}`)
})
