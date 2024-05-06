const { Word } = require('../models');
const Sequelize = require('sequelize');

/**
 * Fetches a word from the database based on the given sequence.
 * @param {string} sequence - The sequence to use to fetch the word.
 * @returns {Promise<Array>} - The word that matches the given sequence.
 */

async function fetchWordsWithSequence(sequence, lo, hi, limit) {
    if(!sequence || sequence === 'none') {
        console.log('No valid sequence provided ');
        return [];
    }

    try {
        const words = await Word.findAll({
            where: {
                word: {
                    [Sequelize.Op.like]: `%${sequence}%`
                },
                [Sequelize.Op.and]: [
                    Sequelize.literal(`LENGTH(word) BETWEEN ${lo} AND ${hi}`)
                ]
            },
            order: [
                // prioritize words by length within the provided range
                [Sequelize.literal('LENGTH(word)'), 'ASC'],
            ],
            limit: limit
        });

        return words.map(word => word.word);
    } catch (error) {
        console.error('Error fetching words with sequence:', error);
        return [];
    }
}

module.exports = {
    fetchWordsWithSequence
}

