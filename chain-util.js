const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

class ChainUtil {
    static genKeyPair () {
        return ec.genKeyPair();
    }

    static uuid() {
        return uuidV1();
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, datahash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(datahash, signature);
    }
}

module.exports = ChainUtil;
