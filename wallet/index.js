const { INITIAL_BALANCE } = require('../config.js')
const ChainUtil = require('../util/chain-util.js')
const Transaction =  require('./transaction')

class Wallet {
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet - 
            publicKey : ${this.publicKey.toString()}
            balance   : ${this.balance}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recepient, amount, blockchain ,transactionPool){
        // calculate and set the balance
        this.balance = this.calculateBalance(blockchain);

        if(amount > this.balance){
            console.log(`Insufficient balance. ${amount} is less than ${this.balance}`)
            return
        }

        let tranasactionInPool =  transactionPool.existingTrasaction(this.publicKey);
        if(tranasactionInPool){
            //update the transction - exisint tx
            tranasactionInPool.updateTransaction(this, recepient, amount);
        }else{
            //add tx into the pool - new tx
            tranasactionInPool =  Transaction.newTransaction(this,recepient,amount)
            transactionPool.updateOrAddTranction(tranasactionInPool);

        }
        return tranasactionInPool;
    }

    static blockchainWallet(){
        const bcWallet =  new this();
        bcWallet.publicKey = "blockchain-wallet";
        return bcWallet;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];

        // Get all tranasctions
        blockchain.chain.forEach(block => {
            block.data.forEach(tx => {
                transactions.push(tx);
            })
        });

        // get inputs wrt this user
        const walletInputTs = transactions
            .filter(tx => tx.input.address === this.publicKey);

        
        let startTime = 0;
        if(walletInputTs && walletInputTs.length > 0){
            // get the most recent input tranasaction
            const recentInputT = walletInputTs
            .reduce((prev, current) => {
                prev.input.timestamp > current.input.timestamp ? prev : current;
            })

            // get the output of most recent tx
            balance = recentInputT.outputs.find(op => op.address === this.publicKey).amount;
            
            // record the timestamp that tx
            startTime = recentInputT.input.timestamp;
        }

        // loop through all the transactions
        transactions.forEach(tx => {
            if(tx.input.timestamp > startTime){
                // get outputs amounts and add them up
                tx.outputs.find(op => {
                    if(op.address === this.publicKey){
                        balance += op.amount;
                    }
                })
            }
        })
        return balance;
    }
}   

module.exports = Wallet;