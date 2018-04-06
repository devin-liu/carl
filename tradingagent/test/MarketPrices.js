var assert = require('assert');
const TransactionParser = require('../TransactionParser.js');
describe('TransactionParser', function() {
  const orderbook = new TransactionParser();
  describe('#calculateArrayTotal', function() {
    it('should calculate total value of arrays length of 0, 1, and 4', function() {
      assert.equal(orderbook.calculateArrayTotal(), 0);
      assert.equal(orderbook.calculateArrayTotal([1]), 1);
      assert.equal(orderbook.calculateArrayTotal([1,2,3,4]), 10);
    });
  });

  describe('#calculateNetValue', function() {
    it('should calculate difference of two arrays', function() {
      assert.equal(orderbook.calculateNetValue([0], null), 0);
      assert.equal(orderbook.calculateNetValue([0,2], null), 2);
      assert.equal(orderbook.calculateNetValue([0,2], [1]), 1);
    });
  });
});
