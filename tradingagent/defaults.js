const ALLCOINACTIONS = [
  'buy',
  'sell',
  'HODL',
  'clear',
  'sellETH️',
  'sellBTC️',
  'sellLTC️',
  'sellBCH️',
  'HODL️',
];

const ONECOINACTIONS = [
  'BUY',
  'SELL',
  'HODL',
  'CLEAR',
]


function getNumberOfCombinations(width) {
  return 2**width;
}


const BOOKCOMBINATIONS = [
  [0,0,0,0,0],
  [0,0,0,0,1],
  [0,0,0,1,1],
  [0,0,1,1,1],
  [0,1,1,1,1],
  [1,1,1,1,1],
  [1,1,1,1,0],
  [1,1,1,0,0],
  [1,1,0,0,0],
  [1,0,0,0,0],
]

module.exports = {
  ALLCOINACTIONS,
  ONECOINACTIONS,
  getNumberOfCombinations,
}
