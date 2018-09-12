const Block = require("./block.js")
const BlockChain = require("./index.js")

describe('Blockchain', ()=>{
    let bc, bc2;
    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();
    })

    it('should start with genesis block', ()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    })

    it('should add a new block', ()=>{
        const data = 'block-data 01';
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    })

    it('validates the valid chain' , () => {
        const data = 'block-data 01';
        bc2.addBlock(data)
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    })

    it('invalidates the chain with corrupt genesis block' , () => {
        bc2.chain[0].data = 'Bad value';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('invalidates the chain with corrupt blocks' , () => {
        bc2.addBlock('block-data 01')
        bc2.chain[1].data = 'Bad value';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('replaces the current chain with new valid chain', ()=>{
        bc2.addBlock('foo')
        bc.replaceChain(bc2.chain)
        expect(bc.chain).toEqual(bc2.chain)
    })

    it('should NOT replaces as incoming chain is shorter than existing block', ()=>{
        bc.addBlock('foo')
        bc.replaceChain(bc2.chain)
        expect(bc.chain).not.toEqual(bc2.chain)
    })
})