'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Words', {
      [Sequelize.Op.or]: [
        {
          word: { [Sequelize.Op.like]: '%[A-Z]%' }
        },
        {
          word: { [Sequelize.Op.like]: '%[^a-z]%' }
        }
      ]
    });
  },

  async down (queryInterface, Sequelize) {
    console.log('This migration cannot be reverted.');
  }
};
