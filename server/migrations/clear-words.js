'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('words', null, {});
  },

  async down (queryInterface, Sequelize) {
    console.log('No down migration for deletion');
  }
};
