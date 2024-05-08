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

        await queryInterface.bulkInsert('Users', [{
            email: "admin@gmail.com",
            password: adminPassword,
            name: "Admin",
            dob: new Date(),
            phoneNumber: "0123456789",
            address: "Hanoi",
            status: 1,
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Users', null, {});
    }
};
