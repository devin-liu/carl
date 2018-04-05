// Data received from market update events: timestamps and reval- prices
// Data calculated through trading activity: orders, positions, pls, fitnesses, trades, and tradestats
// Data pertaining to communication with other agents:
  // incomingmessages,
  // outgoingmessages,
  // and recipients,
  // the latter being the list of agents that are declared as receivers of the agent’s potential communications.

class Agent {
  constructor(name) {
    this.name = name;
    this.timestamps = [];
    this.revalprices = [];
    this.orders = [];
    this.positions = [];
    this.pls = [];
    this.fitnesses = [];
    this.trades = [];
    this.tradestats = [];
  }
}


class Event {
  constructor(timestamp, value) {
    this.timestamp = timestamp;
    this.value = value;
  }
}


class MarketUpdate() extends Event {
  constructor(security) {
    this.security = security
  }
}


function consume(agent, event) {
  // observe(agent, event){

  //   update(agent, event){

  //   }
  // }
}


