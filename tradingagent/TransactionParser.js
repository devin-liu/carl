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

function calculateNetValue(listA, listB) {
  const totalA = this.calculateArrayTotal(listA);
  const totalB = this.calculateArrayTotal(listB);
  return totalA - totalB;
}

function calculateAvgBookPrice(book) {
  const bookCosts = book.map(parsePositionValue);
  const bookVolumes = book.map(parseOrderSize);
  return this.calculateArrayTotal(bookCosts) / this.calculateArrayTotal(bookVolumes);
}

function parseOrderPrice(order) {
  return parseFloat(order[0]);
}

function parseOrderSize(order) {
  return parseFloat(order[1]);
}

function parsePositionSize(pos) {
  return parseFloat(pos.size);
}

function parsePositionValue(pos) {
  return parseFloat(pos.price) * parseFloat(pos.size);
}



TransactionParser.prototype.calculateArrayTotal = calculateArrayTotal;
TransactionParser.prototype.calculateNetValue = calculateNetValue;
TransactionParser.prototype.parseOrderPrice = parseOrderPrice;
TransactionParser.prototype.parseOrderSize = parseOrderSize;
TransactionParser.prototype.parsePositionSize = parsePositionSize;
TransactionParser.prototype.parsePositionValue = parsePositionValue;
TransactionParser.prototype.calculateAvgBookPrice = calculateAvgBookPrice;
module.exports = TransactionParser;
