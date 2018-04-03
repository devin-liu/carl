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
  {buys: [1,0,0,0,0], sells: [0,0,0,0,0]},
  {buys: [1,1,0,0,0], sells: [0,0,0,0,0]},
  {buys: [1,1,1,0,0], sells: [0,0,0,0,0]},
  {buys: [1,1,1,1,0], sells: [0,0,0,0,0]},
  {buys: [1,1,1,1,1], sells: [0,0,0,0,0]},
  {buys: [0,0,0,0,0], sells: [0,0,0,0,0]},
  {buys: [0,0,0,0,0], sells: [1,0,0,0,0]},
  {buys: [0,0,0,0,0], sells: [1,1,0,0,0]},
  {buys: [0,0,0,0,0], sells: [1,1,1,0,0]},
  {buys: [0,0,0,0,0], sells: [1,1,1,1,0]},
  {buys: [0,0,0,0,0], sells: [1,1,1,1,1]}
]





module.exports = {
  ONECOINACTIONS,
  getNumberOfCombinations,
  BOOKCOMBINATIONS,
}
