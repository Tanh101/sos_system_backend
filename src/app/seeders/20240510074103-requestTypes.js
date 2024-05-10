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

        await queryInterface.bulkInsert('requestTypes', [{
            name: requestTypeName[0],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[1],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[2],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[3],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[4],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[5],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[6],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: requestTypeName[7],
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
        await queryInterface.bulkDelete('requestTypes', null, {});
    }
};
