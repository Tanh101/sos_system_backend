'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('requests', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            rescuerId: {
                type: Sequelize.BIGINT(20),
                allowNull: true,
                foreignKey: true
            },
            requestTypeId: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: [10, 500]
                }
            },
            isEmergency:
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            voteCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_userId',
            fields: ['userId'],
            references: {
                table: 'users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_rescuerId',
            fields: ['rescuerId'],
            references: {
                table: 'users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_requestTypeId',
            fields: ['requestTypeId'],
            references: {
                table: 'requestTypes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('requests', 'FK_requests_userId')
        await queryInterface.removeConstraint('requests', 'FK_requests_requestTypeId')
        await queryInterface.dropTable('requests');
    }
};
