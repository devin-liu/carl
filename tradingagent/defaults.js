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
  ONECOINACTIONS,
  getNumberOfCombinations,
  BOOKCOMBINATIONS,
}
