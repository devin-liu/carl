const ticker = {
  "type": "ticker",
  "trade_id": 20153558,
  "sequence": 3262786978,
  "time": "2017-09-02T17:05:49.250000Z",
  "product_id": "BTC-USD",
  "price": "4388.01000000",
  "side": "buy", // Taker side
  "last_size": "0.03000000",
  "best_bid": "4388",
  "best_ask": "4388.01"
};

const snapshot = {
  "type": "snapshot",
  "product_id": "USD-ETH",
  "bids": [["1", "2"]], //   [price, size]
  "asks": [["2", "3"]]
}

const done = {
  type: 'done',
  side: 'buy',
  order_id: 'cb2f2db4-7fc7-405d-a839-5807f02e5589',
  reason: 'filled',
  product_id: 'ETH-USD',
  price: '379.64000000',
  remaining_size: '0.00000000',
  sequence: 3247430598,
  user_id: '56134d7dd656900f34000310',
  profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
  time: '2018-04-06T02:23:10.707000Z'
}

const match = {
  type: 'match',
  trade_id: 31735110,
  maker_order_id: '2f8ddc3c-5444-46f2-8166-9e5e18f99204',
  taker_order_id: 'cb2f2db4-7fc7-405d-a839-5807f02e5589',
  side: 'sell',
  size: '0.01000000',
  price: '379.64000000',
  product_id: 'ETH-USD',
  taker_user_id: '56134d7dd656900f34000310',
  user_id: '56134d7dd656900f34000310',
  taker_profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
  profile_id: 'd18e4765-3946-459c-bb98-f828ae84ba0f',
  sequence: 3247430597,
  time: '2018-04-06T02:23:10.707000Z'
}
