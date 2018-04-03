const ExchangeWorld = require('./ExchangeWorld.js');
const QLearner = require('./q-learner.js');
const Trainer = require('./train.js');

const world = new ExchangeWorld(5, 'ETH-USD', null, {});
const agent = new QLearner(world);
const pair_string = 'ETH-USD';

const trainingAgent = new Trainer(agent, world, pair_string);
trainingAgent.init(20000, 1000, 5);

