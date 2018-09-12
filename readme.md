1. We will create a Block
    - Timestamp : when the block is created
    - Previous HASH : Hash of previous block
    - HASH : Hash of this block
    - Data : Transactions inside this block

2. We need to think of creating Genesis block 
    - First block
    - Hardcoded block
    
3. Now we gonna add MineBlock(lastBlock, data) function

4. For SHA256 hash, we gonna use, crypto-js npm module.

5. Now create Blockchain class
    - array of blocks
    - first element will be the genesis block
    - add a block into the blockchain

6. Now multiple contibutor need to add a record into the blockchain - consensus
    - Multiple contributor
    - Miner will have thier own version
    - When one miner submits a block, that block needs to be accepted by all other miners
    - Every one gets the updated copy 
    - Inorder to updated the mined block, there had to be some sort of validation, so that other miners will validate and add that block into the ledger.

7. Chain Validations
    - Longer Chain Rule
        - 
    - Hash Validation
        - Blockchain receieves new chain, it will regenerate the hash once again on it own
        - This is to ensure that the data was not tampered
        - Then blockchain will decide whether to accept the new block or not.

8. Next : The app will allow a uesr to interact the blochain via http request : 
    - API using express
    - /blocks api
    - /mine api

9. On top of that, we have to built a Network so that multiple users/miners can update the chain.
    - P2P server
    - Websocket for P2P server
    - It allows to csetup a virtually real time connection
    - It will open up a port where it will listen to web socket connection
    - As other node fire up the application, they will setup their own web socket connection too
    - But they now conenct to original server throught that open webssocket port and likewise the original server can detect that new instances have attempted to open a web socket connection.
    - Overall these peers will have the ablitiy to broadcast data to all the connected peers. 
    
10. So P2P is basically 2 steps process
    - 1st, one server will fire up the websocket connection.and will wait for other connections
    - 2nd, other servers will fire up their own connection and will connect to the original server.

11. Work on Sockets receiving/sending messages amoung each other

12. Synchronizing blocks acoss peers.
    - Whenever a new peer gets added -> in syncChain() -> replace the chain with new chain(of course if it is longer and other validation is passed)
    - when ever /mine api gets called -> call for syncChain() method.

13. Till now fair enough. But we are allowing any one to add any block. Which means that any one can add any invalid data (as of now we are just giving some random text in data parameter but ideally that will be transactions)
    - Which mean we have to make use of DIFFICULTY and NOUNCE
    - Miners must spent bit of computation power to add a block
    - We can set DIFFICULTY as "generated hash should have 4 leading zeros"
    - We will set NOUNCE = 0 initially and keep procuding hash and will keep checking if it met DIFICULTY or not
    - If not we will keep on increasing NOUNCE by 1 and then regenerate hash
    - We also have to make sure that this DIFFICULTY should adjust time to time 
    - This is nothing but POW : proof of work
    
14. Now we want our blockchain to : *Dynamically change the DIFFICULTY*
    - based on how frequently we generate a block
    - Currently its static value set in config file as 4. it would take roughly same amount of time to mine each block
    - As more peers added to the network, blocks will be discovered at faster rate... which means that there will higher chance for 1 miner to add the block (which leads to centralization again).
    - So the difficulty should be dynamically adjusting as new miners are added to the blockchain
    - Which means the blocks are mined in certain rate (say every 5 sec or 1 min or even 10 min like Bitcoin does)
    
15. How we achieve the *Dynamic Difficulty*
    - We add `difficulty` attribute to each block
    - Also we will add time value , `mine rate` : which represents rate at which each block will get mined
    - Will check timestamp of newly mined block and compare the timestamp of previously mined block
    - If difference between both timestamp is lower than `mine rate` -> `difficulty` was easy -> raise it by 1
    - If difference between both timestamp is greated than `mine rate` -> `difficulty` was hard -> lower it by 1
    - In this weas we keed adjusting the `difficulty` as blocks are added.

16. Now let's focus on creating Crypto currencies and Wallets for our blockchain.
    - Pre-requisite : *Digital signature concept*
    - Components to implement :
        - we need wallet for individual users
        - we need keys(pk/sk) for digital signature and verifications for users
        - we also have to implement transaction object to represent currency exhanges between the individuals.

17. Lets create a Wallet
    - Create a wallet object which will have private and public keys for the individual wallets.
    - Will will give Initial balance to every one to get going. This initial balance can be set in the config file.
    - We gonna make use of npm module - `npm i elliptic` to generate priv/pub key pair.
    - Bit coin uses [**secp256k1**](https://en.bitcoin.it/wiki/Secp256k1) : refers to the parameters of the elliptic curve used in Bitcoin's public-key cryptography, and is defined in *Standards for Efficient Cryptography (SEC)*. 
    - genKeyPair() will be used to generate key pair.

18. Creating tranasaction object : 3 components
    - input field : who is sending tx and how much he owns
    - output field : 1) what data(how much currency) is in tx and to whom before the tx.
                     2) how much he will have after the tx is compelete.
    - unique id  : identify the tx : `npm i uuid` uuid for generating ids.

19. Transaction Pool
    - Multiple individuals will be creating tx simulataneously, we need to cpature them first in some buffer - traction pool, from which miners will pick up a tranctions and validate it
    - The pool will be nothing but an `object` which will contains all the tranctions submitted by all peoples.
    - As they do so, the status of tx will be *Unconfirmed*
    - Miners will create block using these txs (group of tx), and that confirms tranctions.

20. Shared transaction pool : Tx pool synchromization
    - Now we have to make sure that, when ever a user submits tthe transaction, it should go into a          commonly  shared transcation pool. 
    - Which means tx. pools sync
    - We will make use of web socket for synchronisation tx pool just like we did for blockchain
    - In short adding `tx-pool` to p2p server. - `broadCastTransaction()`
    - First we will create instances of `Wallet` and `TransactionPool`
    - Lets add APIs for getting and addign trasactions.
        - /transactions
        - /transact

21. Binding transactions from pool into blockchain : Including transctions as data into block
    - So far `data` in `block` object is some text.
    - That property has to be filled with actual transactions, picked up from the tx pool by miners and inculde into data property to form a block. this process is called mining.
    - So basically, miner, will call [/mine](http://localhost:3001/mine) endpoint to do this.
    - Which means that we need to tie blockchain with the transaction pool. - that's exactly what our `Miner` class will do.
    - Also notice that for doing this work, miner should get some rewards too.

22. Steps for mining 
    - Grab valid tx from pool.
        - Its total output amount matches the total input amount 
        - Verify the signature of every tx to make sure data is not currupted after it is signed by sender.
    - Give rewards to miner : Include reward tx for the miner.
        - Transaction object similar to normal transactions except there will be just 1 output : the one which miner receives and since there is no exchange necessary, no exchange out put is required.
        - But the input object will be unique that identifies that blockchain itself conducted the transctions - blockchain itself signs the transaction.
        - Which also means that, the blockchain should have a wallet too. 
    - Create block consisiting of valid transactions.  
    - Synchronize the chains in P2P server.
    - Clear the tx pool which is local to miner.
    - Broadcast to every miner to clear their tx pool so that they wont mine on the same block..

23. Updating balance of wallets
    - Balance will be : *All output amounts that belongs to the user*
    - Update balance at each tranasaction happens to-from the user.
    - Balance calculation will be based on output values in the most recent tranasctions happened in blockchain.

## Tech Used
- Jest : for testing 

## Key words to learn
- ws protocol
- web socket with node js
- builging peer to peer chat app

## Commands
1. npm run dev
2. HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
3. HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

## References 

- https://docs.google.com/document/d/1h8Ow3OHdHyHjgK0MtMryCrgR5stb51bPmaIhIAi54Q0/
- https://en.bitcoin.it/wiki/Secp256k1 
- http://www.secg.org/sec2-v2.pdf
- https://bitcoin.org/en/resources 
-https://www.khanacademy.org/economics-finance-domain/core-finance/money-and-banking/bitcoin/v/bitcoin-transaction-records 
- https://en.bitcoin.it/wiki/Bitcoin 
- https://github.com/bitcoin/bips 
- http://bcoin.io/ 

