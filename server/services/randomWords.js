const { Word } = require('../models');
const Sequelize = require('sequelize');

async function fetchRandomWords(sequence) {
  try {
    const lettersArr = sequence.split('');
    const randomLetters = lettersArr.sort(() => 0.5 - Math.random()).slice(0, 3);

    let words = await fetchWordsWithLetters(randomLetters, 3);
    if (words.length < 5) {
      words = await fetchWordsWithAtLeastNLetters(randomLetters, 2);
    }
    const list = words.map(word => word.word);
    return list;
  } catch (error) {
    console.error('Error fetching random words:', error);
    return [];
  }
}

async function fetchWordsWithLetters(letters, requiredCount) {
  console.log('Letters picked:', letters); // Debugging output

  const conditions = letters.map(letter => ({
    word: {
      [Sequelize.Op.like]: `%${letter}%`
    }
  }));

  try {
    return Word.findAll({
      where: {
        [Sequelize.Op.or]: conditions.slice(0, requiredCount)
      },
      limit: 100
    });
  } catch (error) {
    console.error('Error in fetchWordsWithLetters:', error);
    throw error;
  }
}

async function fetchWordsWithAtLeastNLetters(letters, n) {
  const combinations = getCombinations(letters, n);
  const queries = combinations.map(combination => ({
    [Sequelize.Op.and]: combination.map(letter => ({
      word: {
        [Sequelize.Op.like]: `%${letter}%`
      }
    }))
  }));

  try {
    return Word.findAll({
      where: {
        [Sequelize.Op.or]: queries
      },
      limit: 100
    });
  } catch (error) {
    console.error('Error fetching words with at least N letters:', error);
    throw error;
  }
}

function getCombinations(array, size) {
  function* doCombination(offset, combo) {
    if (combo.length === size) {
      yield combo;
    } else {
      for (let i = offset; i < array.length; i++) {
        yield* doCombination(i + 1, combo.concat(array[i]));
      }
    }
  }
  return Array.from(doCombination(0, []));
}

module.exports = { fetchRandomWords };