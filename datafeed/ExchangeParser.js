function getSpreadAsPriceUncertainty(lambda, price, sigma, averageTransactionTime) {
  return lambda*price*sigma*Math.sqrt(averageTransactionTime);
}

function getAverageTransactionTime(averageTransactionSize, tradingVolume) {
  return averageTransactionSize / tradingVolume;
}

function getSpreadFromAskAndBid(ask, bid) {
  return ask-bid;
}

function getPositiveStraddlePLRange(call, put) {

  return 2(call+put)
}

// return Math.sqrt(8/Math.PI)*price


module.exports = {
  getSpread
}

// lambda = dimensionless coefficient
// s = price
// sigma = volatility
// dz = random variable obeing standard normal distribution

// const g = require('./ExchangeParser.js')
