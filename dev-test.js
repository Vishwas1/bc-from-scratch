// const Block = require('./blockchain/block');

// const block01 = Block.mineBlock(Block.genesis(), 'Block01');
// console.log(block01.toString());

// const block02 = Block.mineBlock(block01, 'Block02')
// console.log(block02.toString());

const Wallet = require('./wallet')
const wallet  = new Wallet();

console.log(wallet.toString());