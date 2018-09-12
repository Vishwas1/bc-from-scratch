const ChainUtil = require('../util/chain-util.js')
const { MINING_REWARD } =  require('../config')
class Transaction {
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = []; // 2 o/ps. 1. How much sender wants to send 2. How much he will have after tx is complete
    }

    updateTransaction(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(op => op.address === senderWallet.publicKey);
        if(amount > senderWallet.balance){
            console.log(`Amount ${amount} exceeds balance`)
            return;
        }

        senderOutput.amount -= amount;

        this.outputs.push ({amount, address  : recipient});
        Transaction.signTransaction(this, senderWallet)

        return this;
    }

    static formTransaction(senderWallet, outputs){
        const trasaction = new this();
        // '....' represents ES6 spread opeartor
        trasaction.outputs.push(...outputs);

        Transaction.signTransaction(trasaction, senderWallet);
        return trasaction
    }

    static newTransaction(senderWallet, recipient, amount){
        
        if(amount > senderWallet.balance){
            console.log(`Amount ${amount} exceeds balance`)
            return;
        }

        const outputs = [
            {amount  : senderWallet.balance - amount ,  address : senderWallet.publicKey},
            {amount  : amount ,  address : recipient}
        ];

        return Transaction.formTransaction(senderWallet, outputs);
    }


    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.formTransaction(blockchainWallet, [
            {
                amount : MINING_REWARD,
                address : minerWallet.publicKey
            }
        ])
    }

    static signTransaction(trasaction, senderWallet){
        trasaction.input = {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            signature : senderWallet.sign(ChainUtil.hash(trasaction.outputs))
        }
    }

    static verifyTranasction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature, 
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;