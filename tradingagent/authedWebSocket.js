const Gdax = require('gdax');

const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_API_PASSPHRASE;

const websocket = new Gdax.WebsocketClient(
  ['ETH-USD'],
  'wss://ws-feed.gdax.com',
  {
    key,
    secret,
    passphrase,
  },
  { channels: ['user'] }
);

module.exports = websocket;
