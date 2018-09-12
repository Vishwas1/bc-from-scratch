//ECDSA
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // what curve based cryptography EC insance should use? - secp256k1 bitcoin uses
const uuidV1 = require('uuid/v1');
const SHA256  = require('crypto-js/sha256');

class ChainUtil{
    
    static genKeyPair(){
        return ec.genKeyPair();
    }

    static id(){
        return uuidV1();
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publikey, signature, datahash){
        return ec.keyFromPublic(publikey, 'hex').verify(datahash, signature)
    }

}

module.exports = ChainUtil;