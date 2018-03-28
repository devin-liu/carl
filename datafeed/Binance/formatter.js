const exampleOrders = require('./binance-example-orderbook.js');

function splitOrderBookSymbol(order){
  const toSym = order.symbol.substr(order.symbol.length-3);
  const fromSym = order.symbol.substring(0, order.symbol.length-3);
  return Object.assign({}, {fromSym,toSym});
}


const ethLoopRatios = {}
const btcLoopRatios = {}
const ethPerAltRates = {}
const btcPerAltRates = {}

// console.log(splitOrderBookSymbol(exampleOrders[0]))

function ethLoopRatio(altCoin) {
  // ethPerAltRates[altCoin].
  // eth -> altc, altc -> btc, btc-> eth
  let ethPerAlt;
  // 1/300 | 300
  let altPerBtc;
  // 300/.006 | 1.8
  let btcPerEth = btcPerAltRates['ETH'];
  // 10/1 | 18
  if(ethPerAltRates[altCoin]){
    ethPerAlt = 1/parseFloat(ethPerAltRates[altCoin].askPrice);
  }
  if(ethPerAlt && btcPerAltRates[altCoin]){
    altPerBtc = parseFloat(btcPerAltRates[altCoin].askPrice);
  }
  if(ethPerAlt && altPerBtc && btcPerEth){
    return ethPerAlt*altPerBtc*(1/parseFloat(btcPerEth.askPrice));
  }
  // console.log(ethPerAlt, altPerBtc, btcPerEth)
  return false;
}

function btcLoopRatio(altCoin) {
  let btcPerAlt;
  let altPerEth;
  let btcPerEth = btcPerAltRates['ETH'];

  if(btcPerAltRates[altCoin]){
    btcPerAlt = 1/(parseFloat(btcPerAltRates[altCoin].askPrice));
  }
  if(btcPerAlt && ethPerAltRates[altCoin]){
    altPerEth = parseFloat(ethPerAltRates[altCoin].askPrice);
  }
  // console.log(btcPerAlt , altPerEth , btcPerEth)
  if(btcPerAlt && altPerEth && btcPerEth){
    return btcPerAlt * altPerEth * (parseFloat(btcPerEth.askPrice));
  }
  return false;
}


// const ethLoopRatios = {}
// const ethPerAltRates = {}
// const btcPerAltRates = {}

function splitOrders(orders) {

  orders.map((order) => {
    const {fromSym, toSym} = splitOrderBookSymbol(order)
    if(toSym === 'ETH'){
      ethPerAltRates[fromSym] = order;
    }
    if(toSym === 'BTC'){
      btcPerAltRates[fromSym] = order;
    }
  })
  return Promise.resolve();
}


function getLoopRatios(orders) {
  orders.map((order) => {
    const {fromSym, toSym} = splitOrderBookSymbol(order)
    const ethRatio = ethLoopRatio(fromSym);
    const btcRatio = btcLoopRatio(fromSym);
    if(ethRatio){
      ethLoopRatios[fromSym] = ethRatio;
    }
    if(btcRatio){
      btcLoopRatios[fromSym] = btcRatio;
    }

  })
  return Promise.resolve();
}



function parseOrderBook(orders) {

  return splitOrders(orders)
  .then(() => {
    return getLoopRatios(orders);
  }).then(() => {
    // console.log(ethPerAltRates)
    // console.log(ethPerAltRates['BTC'])
    // console.log(btcPerAltRates['ETH'])
    // console.log(btcPerAltRates)
    for(let symbol in ethLoopRatios){
      console.log(`${symbol}| ETH: ${ethLoopRatios[symbol]} | BTC: ${btcLoopRatios[symbol]}`)
      console.log(`${(ethLoopRatios[symbol] + btcLoopRatios[symbol])/2}`)
    }
    return { ethPerAltRates, btcPerAltRates, ethLoopRatios, btcLoopRatios }
  })
}

function parseLoopRatioDiffs({ethLoopRatios, btcLoopRatios}) {
  let parsedEthRatios = [];
  let parsedBtcRatios = [];
  for(let ratio in ethLoopRatios){
    parsedEthRatios.push(Math.abs(1-ethLoopRatios[ratio]))
  }
  for(let ratio in btcLoopRatios){
    parsedBtcRatios.push(Math.abs(1-btcLoopRatios[ratio]))
  }
  return Promise.resolve({parsedEthRatios, parsedBtcRatios})
}


function getVolumeWeightedAveragePrice(orderbook) {

}

// module.exports = parseOrderBook;
parseOrderBook(exampleOrders)
.then(({ethLoopRatios, btcLoopRatios}) => parseLoopRatioDiffs({ethLoopRatios, btcLoopRatios}))
.then(({parsedEthRatios, parsedBtcRatios}) => {
  let maxEth = parsedEthRatios[0]
  let maxBtc = parsedBtcRatios[0]
  for(let i = 0; i < parsedEthRatios.length; i++){
    if(parsedEthRatios[i] > maxEth){
      maxEth = parsedEthRatios[i];
    }
    if(parsedBtcRatios[i] > maxBtc){
      maxBtc = parsedBtcRatios[i];
    }
  }
  console.log(maxEth)
  console.log(maxBtc)
})
