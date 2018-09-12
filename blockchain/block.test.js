const Block = require("./block.js")

describe('Block', ()=>{
    let data, lastBlock, block, difficulty;
    beforeEach(() => {
        // will gets executed before of all its.
        data = "New data";
        lastBlock = Block.genesis();
        // difficulty = DIFFICULTY.DIFFICULTY;
        block = Block.mineBlock(lastBlock, data);
    })

    it('set `data` to match the input', ()=>{
        expect(block.data).toEqual(data);
        
    })

    it('set `lasthash` to match the hash of last block', ()=>{
        expect(block.lasthash).toEqual(lastBlock.hash);
    })

    it('should generated hash that matches with difficulty', ()=>{

        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty))
    })

    
})