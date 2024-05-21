const Trie = require('../../utils/multiway-trie');
const WordFetcher = require('../word-fetcher');
const fs = require('fs');
const path = require('path');

async function buildMWT() {
    const trie = new Trie();
    const wordList = await WordFetcher.fetchAllWords();
    for(let word of wordList) {
        trie.insert(word.toUpperCase());
    }
    return trie;
}

async function writeTrieToFile() {
    const outputFilePath = path.join(__dirname, '../..', 'json', 'trie.json');
    try {
        const trie = await buildMWT();
        const serializedTrie = trie.serialize();
        fs.writeFileSync(outputFilePath, serializedTrie);
        console.log(`Trie written to ${outputFilePath}`);
    } catch (error) {
        console.error('Error writing trie to file:', error);
    }
}

module.exports = {
    buildMWT,
    writeTrieToFile
}
