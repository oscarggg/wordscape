const express = require('express');
const router = express.Router();

const { generateLetters } = require('../services/letter-generator');
const { selectRandomWords } = require('../services/word-selector');
const { capitalizeWords } = require('../services/word-modifier');
const { fetchWordsByAmount, printWords, fetchAllWords } = require('../services/word-fetcher');

router.get('/', async (req, res) => {
    try {
        //const wordList = await generateLetters();
        //const selectedWords = capitalizeWords(selectRandomWords(wordList));
        const selectedWords = await fetchWordsByAmount(12, 3, 6);
        //const selectedWords = await fetchAllWords();
        //printWords(selectedWords);
        res.json(selectedWords);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

