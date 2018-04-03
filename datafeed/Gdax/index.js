const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();

const DB = require('../Database/index.js');




function getProductBook(pairString) {

  publicClient.getProductOrderBook(
    pairString,
    { level: 2 },
    (error, response, book) => {
      if(!error){
        // console.log(`INSERT INTO orderbook values(NOW(), ${book});`)
        const qs = `INSERT INTO orderbook (data, pair_string) values ('${JSON.stringify(book)}', '${pairString}');`;
        console.log(`${pairString}: ${book.sequence}`)
        DB.query(qs);
      }else{
        console.log(error)
      }
    }
  );

}

function getProductTrades(pairString) {

  publicClient.getProductTrades(
    pairString,
    (error, response, book) => {
      if(!error){
        // console.log(`INSERT INTO orderbook values(NOW(), ${book});`)
        const qs = `INSERT INTO trades (data, pair_string) values ('${JSON.stringify(book)}', '${pairString}');`;
        console.log(`${pairString}: ${book.sequence}`)
        DB.query(qs);
      }else{
        console.log(error)
      }
    }
  );

}





function getProductsPoller(){
  setTimeout(() => {
    // getProductBook('BCH-USD');
    // getProductBook('BTC-USD');
    getProductBook('ETH-USD');
    getProductTrades('ETH-USD');
    // getProductBook('LTC-USD');
    getProductsPoller();
  }, 1500)
}

getProductsPoller();


// getProductBook('BTC-USD')


// publicClient.getProductHistoricRates(
//   'BTC-USD',
//   { granularity: 3600 },
//   (error, response, rates) => {
//     console.log(error)
//     console.log(response)
//     console.log(rates)
//   }
// );


// publicClient.getProducts((error, response, data) => {
//   if (error) {
//     // handle the error
//   } else {
//     console.log(response, data)
//     // work with data
//   }
// })
