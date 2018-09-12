const Wallet =  require('../wallet');
const Transaction =  require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        let block;
        //grab tx from pool
        const validTranasctions =  this.transactionPool.validTranasctions();
        // give rewards to miner : include the reward tx for the miner.
        if(typeof validTranasctions !== 'undefined' && validTranasctions.length > 0 ){
            validTranasctions.push(
                Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
            );
            // create block consisiting of valid transactions
            block = this.blockchain.addBlock(validTranasctions);
            // synchronize the chains in P2P server
            this.p2pServer.syncChains();
            // clear the tx pool which is local to miner
            this.transactionPool.clear();
            // broadcast to every miner to clear their tx pool so that they wont mine on the same block.
            this.p2pServer.broadCastClearTransaction();
        }
        
        return block;
    }
}

module.exports = Miner;