const Gdax = require('gdax');

const websocket = new Gdax.WebsocketClient(
  ['ETH-USD'],
  'wss://ws-feed.gdax.com',
  { channels: ['ticker', 'level2'] }
);

module.exports = websocket;
