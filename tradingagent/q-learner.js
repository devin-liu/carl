/******************************
 In Reinforcement Learning, we train agents to learn
 from a particular state what actions are the best, so
 that overall they profit.

 Q-learning is an algorithm that teaches the agent a value function
 usually written Q(s,a). This is the value of taking an action from a state.
 For example, if you're at the edge of the cliff and you go forward you die,
 so you should learn pretty quickly that's a very expensive action that you
 should never take.

 The idea is that if you take enough steps to see the whole world,
 and you take all actions from those steps, eventually you'll learn what
 to do in every step.
 ******************************/

class QLearner {
  constructor(world) {
    // Algorithm configuration. Won't lie, these numbers
    // are usually magic, and take trying out different values
    // before you settle on good ones
    this.alpha = 0.4;    // step size (how much progress we're actually making)
    this.epsilon = 0.2;  // probabily of taking a random action instead of the optimal one
    this.gamma = 0.8;    // discount rate. it trades off the importance of sooner vs later rewards.

    this.world = world;
    this.reset();
  }

  reset() {
    // The value function.
    this.Q = {};

    // Initialize Q(s, a)
    // for all states s, and possible actions from that state,
    for(let key in this.world.states){
      const stateActions = this.world.stateActions[key];
      this.Q[key] = {};
      for (let a in stateActions){
        const stateAction = stateActions[a];
        this.Q[key][stateAction.action.name] = stateAction.reward;
      }
    }
  }



  // train(steps = 10000) {
  //   // Initialize S: Pick a random starting state.
  //   this.currentState = this.world.getNextState();
  //   // this._sequence = [];

  //   // Take steps until you reach the goal.
  //   while (steps--) {
  //     this.step(this.currentState);
  //     this.currentState = this.world.getNextState();
  //   }
  // }

  step(state) {
    // Choose the best action from this state according to the policy.
    const bestAction = this.pickEpsilonGreedyAction(this.Q[state.id]);
    // console.log(bestAction)

    // Take the action A, and get a reward R and the next state S'.
    const stateAction = this.world.stateActions[state.id][bestAction];

    // Update the value function according to this formula:
    // Q(S, A) = Q(S, A) + α[R + γ max_a Q(S', a) − Q(S, A)]
    // This basically means that if this action is good, then the next action
    // we can take after this should put us in a better place
    // in the world than where we are right now. If it doesn't,
    // then this action isn't good.
    // That's how you get to the goal!
    const quantity = this.world.getTradeQuantity(bestAction);
    const stepReward = this.world.getStepReward(bestAction, quantity);
    // if(quantity)console.log(`${bestAction} ${quantity} ${this.world.symbol}`)
    this.world.takeStep(bestAction, quantity);
    const learntReward = this.gamma * stepReward;
    const stepValue = this.alpha * (learntReward - this.Q[state.id][bestAction])
    this.Q[state.id][bestAction] += stepValue;
  }

  // The best action from each state.
  policy() {
    let policy = {};
    for (let s in this.Q) {
      policy[s] = this.pickBestAction(this.Q[s]);
    }
    return policy;
  }

  // Epsilon-greedy means that most of the time we pick the
  // best action (we are "greedy"), but with epsilon probability we pick a
  // random action
  pickEpsilonGreedyAction(values) {
    const randomNumber = Math.random();
    const actions = Object.keys(values);
    if (randomNumber < this.epsilon) {
      return actions[Math.floor(Math.random() * (actions.length-1))];
    } else {
      return this.pickBestAction(values);
    }
  }

  pickBestAction(values) {
    let highestValue = -1;
    let bestAction = -1;
    for (let action in values) {
      if (values[action] > highestValue) {
        highestValue = values[action];
        bestAction = action;
      }
    }
    return bestAction;
  }
}

module.exports = QLearner;
