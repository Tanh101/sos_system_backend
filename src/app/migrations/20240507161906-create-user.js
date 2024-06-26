'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: [6, 255]
                }
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true,
                    len: [10, 12]
                }
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'user'
            },
            refresh_token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
