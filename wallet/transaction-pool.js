const Transation =  require('./transaction')
class TransactionPool {
    constructor(){
        this.transactions = [];
    }

    updateOrAddTranction(transaction){
        let txwithId = this.transactions.find(tx => tx.id === transaction.id);

        if(txwithId){
            // if it already exisits : update the tx
            this.transactions[this.transactions.indexOf(txwithId)] = transaction;
        }else{
            // if it does not exisits : add the tx
            this.transactions.push(transaction);
        }
    }

    existingTrasaction(address){
        return this.transactions.find(t => t.input.address == address);
    }

    validTranasctions(){
        // following conditions..
        const validTxList  = []
        this.transactions.filter(tx => {
            // 1. its total output amount matches the total input amount 
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce 
            const outPutTotal = tx.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if(tx.input.amount != outPutTotal){
                console.log(`Invalid transaction from ${tx.input.address}`);
                return;
            }
            // 2. verify the signature of every tx to make sure data is not currupted after it is signed by sender
            if(!Transation.verifyTranasction(tx)){
               console.log(`Invalid signature`);
               return;
            }
            validTxList.push(tx);
        });
        return validTxList;
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;