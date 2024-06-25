'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('requests', 'danger_status', {
      type: Sequelize.ENUM('active', 'deleted'),
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('requests', 'danger_status')
  }
};
