When you lose money, you must have a lack of discipline or focus or are a macho, fighting obvious patterns and thinking you are smarter than the market.


Carlos is not a macho. She does not fight obvious patterns, she just learns her world.






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
