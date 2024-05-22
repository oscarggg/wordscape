'use strict';
const fs = require('fs');
const path = require('path');
const { Word } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const filePath = path.join(__dirname, '../clean_plural_words.txt');
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const words = fileContent.split('\n').filter(word => word.trim() !== '');

      console.log('Words array:', words); // Debug: Output the words array to check its contents

      if (!Array.isArray(words) || words.length === 0) {
        throw new Error('No words found or file is empty');
      }

      // Prepare data for bulk insert
      const wordsData = words.map(word => ({ word: word }));

      await queryInterface.bulkInsert('Words', wordsData, {});
    } catch (error) {
      console.error('Error in migration:', error);
      throw error; // Rethrow the error to ensure the migration fails
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
