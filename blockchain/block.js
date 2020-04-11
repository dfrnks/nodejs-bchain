const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        let date = new Date(this.timestamp)

        return `Block
            Timestamp : ${this.timestamp}
            Date      : ${date.toLocaleString()} - ${date.getMilliseconds()}ms
            Last Hash : ${this.lastHash.substr(0, 10)}
            Hash      : ${this.hash.substr(0, 10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`;
    }

    static genesis() {
        return new this('Genesis time', '------', 'ZZSdgcr2DRktaMNv', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;

        let hash, timestamp, difficulty;
        let nonce = 0;

        do {
            nonce++;

            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = this.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;

        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;

        return lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    }
}

module.exports = Block;
