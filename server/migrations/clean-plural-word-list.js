'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const file = path.join(__dirname, '../clean_plural_words.txt');
      const words = fs.readFileSync(file, 'utf8')
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(word => word);
      
      // remove all existing words
      await queryInterface.bulkDelete('Words', null, {});
  
      // add new words
      const wordObjects = words.map(word => ({ word: word.toUpperCase() }));
      await queryInterface.bulkInsert('Words', wordObjects, {
        ignoreDuplicates: true,
      });
    } catch (error) {
      console.error('Error inserting clean plural words (up migration):', error);
    }
    
  },

  async down (queryInterface, Sequelize) {
    try {
      const file = path.join(__dirname, '../clean_plural_words.txt');
      const words = fs.readFileSync(file, 'utf8').split('\n')
        .map(word => word.trim().toUpperCase()).filter(word => word);
    
      // remove all words
      await queryInterface.bulkDelete('Words', null, {});
      // add current words back
      const wordObjects = words.map(word => ({ word: word.toUpperCase() }));
      await queryInterface.bulkInsert('Words', wordObjects, {});
    } catch (error) {
      console.error('Error in down migration of plural words:', error);
    }
  }
};
