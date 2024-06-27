'use strict';
const bcrypt = require('bcrypt');

const { USER_STATUS, USER_ROLE } = require('../../constants/constants');
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
            email: "lyvantanh@gmail.com",
            password: adminPassword,
            name: "Lý Văn Tánh",
            dob: new Date("2002-07-20"),
            phone_number: "0329555777",
            address: "16 Ngô Sĩ Liên, Liên Chiểu, Đà Nẵng",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.USER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "nguyentienlinh@gmail.com",
            password: adminPassword,
            name: "Nguyễn Tiến Linh",
            dob: new Date("2001-07-20"),
            phone_number: "0329555772",
            address: "121 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.USER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "nguyenquanghai@gmail.com",
            password: adminPassword,
            name: "Nguyễn Quang Hải",
            dob: new Date("1998-07-20"),
            phone_number: "0329555112",
            address: "422 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.USER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "test@gmail.com",
            password: adminPassword,
            name: "Nguyen Dang Hoang",
            dob: new Date("1992-07-20"),
            phone_number: "0329555166",
            address: "422 Phan Chu Trinh, Hải Châu, Đà Nẵng",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.USER,
            created_at: new Date(),
            updated_at: new Date()
        }], {});

        await queryInterface.bulkInsert('users', [{
            email: "user@gmail.com",
            password: adminPassword,
            name: "Le Khanh Huy",
            dob: new Date("1992-06-20"),
            phone_number: "0321255166",
            address: "422 Ngũ Hành Sơn, Ngũ Hành Sơn, Đà Nẵng",
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.USER,
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
    }
};
