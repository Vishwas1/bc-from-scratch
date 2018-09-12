const Block = require("./block.js")
class Blockchain{
    constructor(){
        this.chain = [Block.genesis()]
    }

    addBlock(data){
        const lastBlock =  this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);
        return block;
    }

    isValidChain(chain) {
        // incoming geesis is not valid for new cahin
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){    
            return false;
        } 
        // run validation for every block after the genesis block in incoming chain
        for(let i=1; i < chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1]
            // current blockc last hash should match the hash of last block
            // also check if some one has tampered with the data or not
            if(block.lasthash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)){
                return false;
            }
        }

        return true;

    }

    replaceChain(newChain) {

        // longest chain rule..
        // 1st check if the newChain length is > existing chain, if not return
        if(newChain.length <= this.chain.length){
            console.log('newChain.length  : ' , newChain.length )
            console.log('existing.length  : ' , this.chain.length )
            console.log('New chain is shorter or equal to the exisiting.')
            return;
        } else if (!this.isValidChain(newChain)){
            console.log('New chain is not valid.')
            return;
        }

        console.log('Replacing new chain with the current chain.')
        this.chain = newChain;

    }
}

module.exports = Blockchain;