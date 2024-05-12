'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        const adminPassword = await bcrypt.hash('lyvantanh2002', 10);

        await queryInterface.bulkInsert('users', [{
            email: "admin@gmail.com",
            password: adminPassword,
            name: "Admin",
            dob: new Date(),
            phone_number: "0123456789",
            address: "Hanoi Vietnam",
            status: 1,
            role: "admin",
            created_at: new Date(),
            updated_at: new Date()
        }], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('users', null, {});
    }
};
