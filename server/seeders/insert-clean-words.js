'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const wordsData = fs.readFileSync(path.join(__dirname, '../clean_plural_words.txt'), 'utf-8');
    const words = wordsData.split('\n').filter(word => word.trim().length > 0);
    const wordsToInsert = words.map(word => ({
      word: word,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Words', wordsToInsert, {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Words', null, {});
  }
};
