'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('requestMedia', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            requestId: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            url: {
                type: Sequelize.STRING
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

        await queryInterface.addConstraint('requestMedia', {
            fields: ['requestId'],
            type: 'foreign key',
            name: 'FK_requestId',
            references: {
                table: 'requests',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('requestMedia');
    }
};
