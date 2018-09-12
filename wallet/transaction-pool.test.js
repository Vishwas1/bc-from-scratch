const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('.')

describe('TransactionPool', ()=>{
  let senderWallet, transaction,transactionPool , receipent, amount;
  
  beforeEach(()=>{
    senderWallet = new Wallet();  
    amount = 50;
    receipent = "receipent public key";
    transaction = Transaction.newTransaction(senderWallet, receipent, amount);
    transactionPool = new TransactionPool();
    transactionPool.updateOrAddTranction(transaction);
  })

  it('Adds a tranctions into the pool', ()=>{
    expect(transactionPool.transactions.find(tx => tx.id == transaction.id))
    .toEqual(transaction)
  })
  
//   it('It updates a tranctions into the pool', ()=>{
    
//     expect(transactionPool.transactions.find(tx = tx.id))
//     .toEqual(transaction)
//   })
  
})