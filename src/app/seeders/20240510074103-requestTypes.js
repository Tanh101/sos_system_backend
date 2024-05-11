'use strict';

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

        const requestTypeName = [
            'Cứu thương',
            'Bão lụt',
            'Hỏa hoạn',
            'Tai nạn giao thông',
            'Bắt cóc',
            'Cứu vớt',
            'Đuối nước',
            'Động đất',
        ]

        await queryInterface.bulkInsert('request_types', [{
            name: requestTypeName[0],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[1],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[2],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[3],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[4],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[5],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[6],
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: requestTypeName[7],
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
        await queryInterface.bulkDelete('request_types', null, {});
    }
};
