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
        await queryInterface.bulkInsert('requests', [
            {
                user_id: 8,
                rescuer_id: null,
                request_type_id: null,
                content: null,
                is_emergency: 1,
                status: 0,
                latitude: 16.07346,
                longitude: 108.164667,
                address: '35F7+CPH, Nguyễn Chơn, Hoà Minh, Liên Chiểu, Đà Nẵng 550000, Vietnam',
                vote_count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 9,
                rescuer_id: 3,
                request_type_id: null,
                content: null,
                is_emergency: 1,
                status: 1,
                latitude: 16.0783693,
                longitude: 108.1606682,
                address: '140 Hồ Tùng Mậu, Hòa Minh, Liên Chiểu, Đà Nẵng, Vietnam',
                vote_count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 10,
                rescuer_id: null,
                request_type_id: 2,
                content: 'Tôi bị thủng lốp xe, cần sự giúp đỡ.',
                is_emergency: 0,
                status: 3,
                latitude: 16.0636584,
                longitude: 108.2031629,
                address: '32 Nguyễn Tri Phương, Thanh Khê District, Da Nang, Vietnam',
                vote_count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 11,
                rescuer_id: 2,
                request_type_id: 3,
                content: 'Tôi bị mất ví, cần sự giúp đỡ.',
                is_emergency: 0,
                status: 2,
                latitude: 16.0660765,
                longitude: 108.1525834,
                address: '21 Đường Nam Cao, Hòa Khánh Nam, Liên Chiểu, Da Nang, Vietnam',
                vote_count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('requests', null, {});
    }
};
