const ZeroEx = require('0x.js');

// async function getAddresses() {
//   try {
//       var availableAddresses = await zeroEx.getAvailableAddressesAsync();
//       console.log(availableAddresses)
//   } catch (error) {
//       console.log('Caught error: ', error);
//   }
// }

// getAddresses();

async function testThis() {
  const resolved = await hiThere();
  console.log(resolved)
  return resolved;
}

function hiThere(){
  return Promise.resolve('hi there')
}

testThis();
