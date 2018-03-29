const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');


const world = new ExchangeWorld(5, 'BTC', 500, {});
const agent = new QLearner(world);


function train() {
  agent.train(100000);
  world.policy = agent.policy();
  // print profit
  // console.log()
  console.log(`profit: ${world.calculateProfit()}`)
}


function reset() {
  world.reset();
  agent.reset();
}


// world.start()

train();
