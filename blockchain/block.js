const ChainUtil = require('../util/chain-util.js')
const {DIFFICULTY, MINE_RATE} = require('../config.js')

class Block {
    constructor(timestamp, lasthash, hash, data, nounce, difficulty){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
        this.nounce = nounce; 
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {    
        // using ES6 template string.
        return `Block -
            TimeStamp : ${this.timestamp}
            Last Hash : ${this.lasthash}
            Hash      : ${this.hash}
            Data      : ${this.data}
            Nounce    : ${this.nounce}
            Difficulty: ${this.difficulty}
        `;
    }

    static genesis (){
        //return new this('Genesis time','----','f1r57',[])
        const timestamp = 'Some timestamp';
        const lasthash = '';
        const data = [];
        const diff = DIFFICULTY;
        return new this(timestamp,lasthash,Block.hash(timestamp,lasthash, data, 0, diff),data,0, diff)
    }

    static mineBlock(lastBlock, data){
        console.log(DIFFICULTY)
        let timestamp =  Date.now();        
        let {difficulty} = lastBlock;
        let nounce = 0;
        let hash = ''; //Block.hash(timestamp, lasthash, data, nounce);
        const lasthash = lastBlock.hash;
        do{
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock,timestamp);
            nounce++;
            hash =  Block.hash(timestamp, lasthash, data, nounce, difficulty);
            
        }
        while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this(timestamp, lasthash, hash, data, nounce, difficulty); 

    }

    static hash(timestamp, lastHash, data, nounce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nounce}${difficulty}`).toString();
    }

    static blockHash(block){
        const { timestamp ,  lasthash, data, nounce, difficulty} = block;
        return Block.hash(timestamp, lasthash, data, nounce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        // currentTime - lastBlock.timestamp > MINE
        difficulty = lastBlock.timestamp + MINE_RATE  > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block; 