const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require('../wallet')
const TransactionPool = require('../wallet/transaction-pool');
const Miner =  require('./miner');


const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
// inorder to receive data in specific format(JSON), we use body parser 
// it either transform incoming data or outgoing response data.
app.use(bodyParser.json()); // allows us to receive json in post request

// creating instance of blockchain
const bc =  new Blockchain();
// giving user a wallet 
const wallet = new Wallet();
// and giving user a transaction pool
const tp =  new TransactionPool();
// creating instance of p2p server instance
const p2pServer =   new P2pServer(bc, tp);
// creating miner instance 
const miner = new Miner(bc, tp, wallet, p2pServer);

// get request for getting all the blocks
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

// post request for mining a  block
app.post('/mine', (req,res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`A new block added : ${block.toString()}`);
    res.redirect('/blocks');
    p2pServer.syncChains();
})

// get api for transactions
app.get('/transactions', (req,res) => {
    res.json(tp.transactions)
})

// post request for creating tranasctions
app.post('/transact', (req,res) =>{
    //transaction means :  sender, receipient, amount right?
    const {recepient, amount} = req.body;
    console.log(`Amount  : ${amount} && Recepient : ${recepient}`)
    const transaction =  wallet.createTransaction(recepient, amount, bc ,tp);
    res.redirect('/transactions');
    p2pServer.broadCastTransaction(transaction);
})

// get public key api
app.get('/public-key', (req,res)=> {
    res.json({publicKey : wallet.publicKey});
})

// get api to mine transactions
app.get('/mine-transactions',(req, res)=> {
    const block = miner.mine();
    //console.log(`A new block has been added: ${block.toString()}`)
    res.redirect('/blocks');
})

// check the balance
app.get('/balance', (req,res)=>{
    res.json({
        balance : wallet.calculateBalance(bc)
    })
})

app.listen(HTTP_PORT,()=>{
    console.log(`Listening on : ${HTTP_PORT}`);
});


p2pServer.listen();







