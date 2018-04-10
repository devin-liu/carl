const publicWebsocket = require('../../tradingagent/publicWebSocket.js');
const DB = require('../Database/index.js');
publicWebsocket.on('message', handleMessage);


function handleMessage(data) {
  console.log(data)
  console.log(data.type)
  if(data.type === "snapshot"){
    const qs = `INSERT INTO snapshot (data, pair_string) values ('${JSON.stringify(data)}', 'ETH-USD');`;
    DB.query(qs);
  }
}
