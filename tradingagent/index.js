const world = require('./ExchangeWorld.js');





// world.start()




function train(e) {
  agent.train(10000);
  world.policy = agent.policy();
}


function reset() {
  world.reset();
  agent.reset();

}
