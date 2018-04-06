class TransactionParser {};

function calculateArrayTotal(arr) {
  if(!arr || arr.length === 0) {
    return 0;
  }
  if(arr.length === 1) {
    return arr[0];
  }
  return arr.reduce((a,b) => a + b);
}

//  receives list of two integers and subtracts the second from the first
function calculateNetValue(listA, listB) {
  const totalA = this.calculateArrayTotal(listA);
  const totalB = this.calculateArrayTotal(listB);
  return totalA - totalB;
}

function getOrderPrice(order) {
  return parseFloat(order[0]);
}

function getOrderSize(order) {
  return parseFloat(order[1]);
}

TransactionParser.prototype.calculateArrayTotal = calculateArrayTotal;
TransactionParser.prototype.calculateNetValue = calculateNetValue;
TransactionParser.prototype.getOrderPrice = getOrderPrice;
TransactionParser.prototype.getOrderSize = getOrderSize;

module.exports = TransactionParser;
