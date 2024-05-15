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
            email: "rescuer@gmail.com",
            password: adminPassword,
            name: "Nguễn Văn A- Đội cứu hộ Liên Chiểu",
            dob: new Date(),
            phone_number: "0123456781",
            address: "Liên Chiểu, Đà Nẵng,  Vietnam",
            status: 1,
            role: "rescuer",
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer2@gmail.com",
            password: adminPassword,
            name: "Nguễn Văn B- Đội cứu hộ Hải Châu",
            dob: new Date(),
            phone_number: "0123456781",
            address: "Hải Châu, Đà Nẵng,  Vietnam",
            status: 1,
            role: "rescuer",
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