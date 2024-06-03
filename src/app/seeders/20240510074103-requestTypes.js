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
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716899065498"
            },
            {
                name: "Lũ Lụt",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716898992947"
            },
            {
                name: "Hỏa Hoạn",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716898944582"
            },
            {
                name: "Tai Nạn Giao Thông",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716898854926"
            },
            {
                name: "Dịch bệnh",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716899144350"
            },
            {
                name: "Đuối nước",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716899038037"
            },
            {
                name: "Mưa bão",
                icon_url: "https://sossystem.s3.us-east-1.amazonaws.com/1716898895246"
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