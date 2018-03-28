const binance = require('node-binance-api');
const ncp = require('copy-paste');
const Formatter = require('./formatter.js')

binance.options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});

binance.bookTickers((error, ticker) => {
  // console.log("bookTickers()", ticker);
  const { ethPerAltRates, btcPerAltRates, ethLoopRatios } = Formatter(ticker);
  // ncp.copy(ethLoopRatios)
  console.log(ethLoopRatios)
});
