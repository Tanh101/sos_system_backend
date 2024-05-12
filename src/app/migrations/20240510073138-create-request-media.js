'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('request_media', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            request_id: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            url: {
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addConstraint('request_media', {
            fields: ['request_id'],
            type: 'foreign key',
            name: 'FK_request_id',
            references: {
                table: 'requests',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('request_media');
    }
};
