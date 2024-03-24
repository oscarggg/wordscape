const { Word } = require('../models');

async function logRandomWords() {
  try {
    const randomWords = await Word.findAll({
      order: Sequelize.literal('RANDOM()'),
      limit: 10
    });

    console.log('Random Words:');
    randomWords.forEach(word => console.log(word.word));
  } catch (error) {
    console.error('Error fetching random words:', error);
  }
}

module.exports = { logRandomWords };