const WebSocket = require('ws');
const ws = new WebSocket('wss://streamer.cryptocompare.com', {
  perMessageDeflate: false
});
var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD'];
ws.on('open', function open() {
  console.log('opened socket');
  ws.send('SubAdd', {subs :subscription});
  ws.on('message', function incoming(data) {
    console.log(data);
  });
});



let currentPrice = {}
