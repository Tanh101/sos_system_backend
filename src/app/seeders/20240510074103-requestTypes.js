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
            {
                name: "Cứu thương",
                icon_url: "https://img.icons8.com/ios/452/ambulance.png"
            },
            {
                name: "Lũ Lụt",
                icon_url: "https://sossystem.s3.amazonaws.com/flood+(1).png"
            },
            {
                name: "Hỏa Hoạn",
                icon_url: "https://img.icons8.com/ios/452/fire-element.png"
            },
            {
                name: "Tai Nạn Giao Thông",
                icon_url: "https://img.icons8.com/ios/452/car-crash.png"
            },
            {
                name: "Dịch bệnh",
                icon_url: "https://img.icons8.com/ios/452/medical-bag.png"
            },
            {
                name: "Đuối nước",
                icon_url: "https://img.icons8.com/ios/452/forest.png"
            },
            {
                name: "Mưa bảo",
                icon_url: "https://img.icons8.com/ios/452/rain.png"
            }
        ]
        requestTypeName.forEach(async (requestType) => {
            await queryInterface.bulkInsert('request_types', [{
                name: requestType.name,
                icon_url: requestType.icon_url,
                created_at: new Date(),
                updated_at: new Date()
            }], {});
        });

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