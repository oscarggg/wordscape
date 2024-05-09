const Trie = require('../../utils/multiway-trie');
const WordFetcher = require('../word-fetcher');

async function buildMWT() {
    const trie = new Trie();
    wordList = await WordFetcher.fetchAllWords();
    for(let word of wordList) {
        trie.insert(word);
    }
    return trie;
}

