<!-- How I got the keys which were real -->
<!-- Node environment -->
const DB = require('../datafeed/Database/index.js');
let newQ = {}
DB.query(`select * from qmap;`, (error, response) => {
  const qMaps = response.rows.map(row => row.data.currentAgent.Q);
  newQ = qMaps.map(qmap => {
    for(let bookState in qmap){
      const currentState = qmap[bookState];
      for(let action in currentState){
        if(!Number.isInteger(currentState[action])){
          newQ[bookState] = currentState;
          break;
        }
      }
    }
    return newQ
  })
  console.log(newQ)
})




<!-- Get Q from last trained model -->
DB.query(`select * from qmap;`, (error, response) => {
  const qMap = response.rows.map(row => row.data.currentAgent.Q);
  console.log(qMap[qMap.length-1])
})
