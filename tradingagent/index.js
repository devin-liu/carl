const world = require('./ExchangeWorld.js');


const world = new Gridworld(SIZE);
const agent = new QLearner(world);


function train(e) {
  agent.train(10000);
  world.policy = agent.policy();
  // print profit
  // console.log()
}


function reset() {
  world.reset();
  agent.reset();
}


// world.start()
