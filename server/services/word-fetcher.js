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

async function fetchWordsByAmount(amount, minLength, maxLength) {
    if(!amount) {
        console.log('No valid amount provided');
        return [];
    }

    try {
        const words = await Word.findAll({
            where: {
                word: {
                    [Sequelize.Op.and]: [
                        Sequelize.literal(`LENGTH(word) BETWEEN ${minLength} AND ${maxLength}`)
                    ]
                }
            },
            order: Sequelize.literal('RANDOM()'),
            limit: amount
        });

        return words.map(word => word.word);
    } catch (error) {
        console.error('Error fetching words by amount:', error);
        return [];
    }
}

// fetches all words that contain the given letter
async function fetchWordsWithLetter(letter) {
    if(!letter) {
        console.log('No valid letter provided');
        return [];
    }

    try {
        const words = await Word.findAll({
            where: {
                word: {
                    [Sequelize.Op.like]: `%${letter}%`
                }
            }
        });

        return words.map(word => word.word);
    } catch (error) {
        console.error('Error fetching words with letter:', error);
        return [];
    }
}

// retrieve all words from the database
async function fetchAllWords() {
    try {
        const words = await Word.findAll();
        return words.map(word => word.word);
    } catch (error) {
        console.error('Error fetching all words:', error);
        return [];
    }
}

function printWords(words) {

    if(!Array.isArray(words)) {
        console.log('Invalid input: expected an array, received:', words);
        return;
    }

    console.log('Printing words:');
    words.forEach(word => console.log(word));
}

module.exports = {
    fetchWordsWithSequence,
    fetchAllWords,
    fetchWordsWithLetter,
    printWords,
    fetchWordsByAmount
}

