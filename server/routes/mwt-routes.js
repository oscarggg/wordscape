const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Trie = require('../utils/multiway-trie');
const { buildMWT } = require('../services/data-structures/mwt-initializer');

router.get('/trie', async (req, res) => {
    try {
        const trie = await buildMWT();
        const serializedTrie = trie.serialize();
        res.json({ trie: serializedTrie });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send trie data: ' + err.message });
    }
});

module.exports = router;
