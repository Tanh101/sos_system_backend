'use strict';
const { USER_STATUS, USER_ROLE } = require('../../constants/constants');
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
            name: "Hoàng Ngọc Thái- Đội cứu hộ Hải Châu",
            dob: new Date(),
            phone_number: "0123456781",
            address: "20 Hoàng Diệu, Phước Ninh, Hải Châu, Da Nang, Vietnam",
            status: 1,
            role: "rescuer",
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer1@gmail.com",
            password: adminPassword,
            name: "Nguễn Văn Ba- Đội cứu hộ Thanh Khê",
            dob: new Date(),
            phone_number: "0123456112",
            address: "40 Đường Dũng Sĩ Thanh Khê, Thanh Khê District, Da Nang, Vietnam",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.RESCUER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer2@gmail.com",
            password: adminPassword,
            name: "Lê Hữu Thọ- Đội cứu hộ Liên Chiểu",
            dob: new Date(),
            phone_number: "01211567812",
            address: "30 Đường Ngô Thì Nhậm, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng, Vietnam",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.RESCUER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer3@gmail.com",
            password: adminPassword,
            name: "Nguễn Văn Hoàng- Đội cứu hộ Sơn Trà",
            dob: new Date(),
            phone_number: "0362371234",
            address: "44 Tạ Mỹ Duật, An Hải Bắc, Sơn Trà, Đà Nẵng 550000, Vietnam",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.RESCUER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer4@gmail.com",
            password: adminPassword,
            name: "Lê Bá Duy- Đội cứu hộ Cẩm Lệ",
            dob: new Date(),
            phone_number: "0362375555",
            address: "121 Tôn Đức Thắng, Hòa An, Cẩm Lệ, Da Nang, Vietnam",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.RESCUER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "rescuer5@gmail.com",
            password: adminPassword,
            name: "Võ Văn Thành- Đội cứu hộ Ngũ Hành Sơn",
            dob: new Date(),
            phone_number: "0345643221",
            address: "49 Ngũ Hành Sơn, Mỹ An, Ngũ Hành Sơn, Da Nang, Vietnam",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.RESCUER,
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