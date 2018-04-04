var assert = require('assert');
const Inventory = require('../Inventory.js');
describe('Inventory', function() {
  const ethWallet = new Inventory();
  describe('#Init', function() {
    it('should initialize with 0 profit and 0 position', function() {
      assert.equal(ethWallet.getTotalProfit(), 0);
      assert.equal(ethWallet.getTotalPosition(), 0);
    });
  });
});
