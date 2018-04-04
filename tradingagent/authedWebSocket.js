const Gdax = require('gdax');

const key = process.env.GDAX_API_KEY;
const secret = process.env.GDAX_API_SECRET;
const passphrase = process.env.GDAX_API_PASSPHRASE;

const websocket = new Gdax.WebsocketClient(
  ['BTC-USD', 'ETH-USD'],
  'wss://ws-feed-public.sandbox.gdax.com',
  {
    key,
    secret,
    passphrase,
  },
  { channels: ['user'] }
);

module.exports = websocket;
