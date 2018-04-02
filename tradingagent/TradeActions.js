const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_API_PASSPHRASE;

const apiURI = 'https://api.gdax.com';
const sandboxURI = 'https://api-public.sandbox.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  apiURI: sandboxURI
);


// get accounts

//

// Buy 1 BTC @ 100 USD
// const buyParams = {
//   price: '100.00', // USD
//   size: '1', // BTC
//   product_id: 'BTC-USD',
// };
// authedClient.buy(buyParams, callback);

// // Sell 1 BTC @ 110 USD
// const sellParams = {
//   price: '110.00', // USD
//   size: '1', // BTC
//   product_id: 'BTC-USD',
// };
// authedClient.sell(sellParams, callback);


// authedClient.cancelOrders(callback);

// authedClient.getFills(callback);
// // For pagination, you can include extra page arguments
// authedClient.getFills({ before: 3000 }, callback);


// authedClient.getAccountHolds(accountID, callback);

// // For pagination, you can include extra page arguments
// authedClient.getAccountHolds(accountID, { before: 3000 }, callback);


module.exports = {
  buy,
  sell,
  getFills,
  getAccountHolds
}
