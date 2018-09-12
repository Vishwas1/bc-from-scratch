const Transaction = require('./transaction')
const Wallet = require('.')

describe('Transaction', ()=>{
  let senderWallet, transaction, receipent, amount;
  
  beforeEach(()=>{
    senderWallet = new Wallet();  
    amount = 50;
    receipent = "receipent public key";
    transaction = Transaction.newTransaction(senderWallet, receipent, amount);
      
  })

  it('outputs `amount` subtracted from the wallet balance', ()=>{
    expect(transaction.outputs.find(x => x.address === senderWallet.publicKey).amount)
    .toEqual(senderWallet.balance - amount)
  })
  
  it('outputs `amount` added to receipient ', ()=>{
    expect(transaction.outputs.find(x => x.address === receipent).amount)
    .toEqual(amount)
  })

  it('input `amount` should be equal to sender balance ', ()=>{
    expect(transaction.input.amount).toEqual(senderWallet.balance)
  })

  
  it('input `address` should be equal to sender public key ', ()=>{
    expect(transaction.input.address).toEqual(senderWallet.publicKey)
  })

  it('validates the valid transaction', () => {
      expect(Transaction.verifyTranasction(transaction)).toBe(true);
  })

  
  it('invalidates the valid corrupt transaction', () => {
    transaction.outputs[0].amount = 10000000;
    expect(Transaction.verifyTranasction(transaction)).toBe(false);
  })
})