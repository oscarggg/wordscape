const express = require('express');
const router = express.Router();

const { generateLetters } = require('../services/letter-generator');
const { selectRandomWords } = require('../services/word-selector');

router.get('/', async (req, res) => {
    try {
        const wordList = await generateLetters();
        const selectedWords = selectRandomWords(wordList);
        res.json(selectedWords);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

