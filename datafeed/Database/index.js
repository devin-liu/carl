const { Pool, Client } = require('pg')
const connectionString = process.env.GDAX_CONNECTION_STRING;

// const pool = new Pool({
//   connectionString: connectionString,
// })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

const client = new Client({
  connectionString: connectionString,
})
client.connect()

// client.query('SELECT * from orderbook;', (err, res) => {
//   console.log(err, res)
//   client.end()
// })


module.exports = {
  query: (text, callback) => {
    return client.query(text, callback)
  }
}
