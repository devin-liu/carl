const { Action } = require('./state-machine');

const ALLCOINACTIONS = [
  new Action('buy', 0),
  new Action('sell', 1),
  new Action('HODL', 2),
  new Action('clear', 3),
  new Action('sellETH️', 5),
  new Action('sellBTC️', 6),
  new Action('sellLTC️', 7),
  new Action('sellBCH️', 8),
  new Action('HODL️', 9),
];

const ONECOINACTIONS = [
  new Action('BUY', 0),
  new Action('SELL', 1),
  new Action('HODL', 2),
  new Action('CLEAR', 3),
]

module.exports = {
  ALLCOINACTIONS,
  ONECOINACTIONS
}
