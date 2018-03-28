const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();

const DB = require('../Database/index.js');




function getProductBook(pairString) {
  // publicClient.getProductOrderBook(pairString, { level: 2 })
  // .then((error, response, book) => {

  // })


  publicClient.getProductOrderBook(
    pairString,
    { level: 2 },
    (error, response, book) => {
      if(!error){
        // console.log(`INSERT INTO orderbook values(NOW(), ${book});`)
        const qs = `INSERT INTO orderbook (data ) values ('${JSON.stringify(book)}');`;
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
    getProductBook('BCH-USD');
    getProductBook('BTC-USD');
    getProductBook('ETH-USD');
    getProductBook('LTC-USD');
    getProductsPoller();
  }, 1500)
}

getProductsPoller();


// publicClient.getProducts((error, response, data) => {
//   if (error) {
//     // handle the error
//   } else {
//     console.log(response, data)
//     // work with data
//   }
// })
