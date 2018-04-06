const Gdax = require('gdax');

const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_API_PASSPHRASE;


const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  apiURI,
);

module.exports = authedClient
