'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('People', [{
      'first_name': 'John',
      'last_name': 'Doe',
      'birth_date': new Date(),
      'formatted_location': 'Semarang',
      'formatted_location': 'GMT+7',
      'createdAt': new Date(),
      'updatedAt': new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
