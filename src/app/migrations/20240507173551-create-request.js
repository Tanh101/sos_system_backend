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
            user_id: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            rescuer_id: {
                type: Sequelize.BIGINT(20),
                allowNull: true,
                foreignKey: true
            },
            request_type_id: {
                type: Sequelize.BIGINT(20),
                allowNull: true,
                foreignKey: true
            },
            content: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_emergency:
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
            vote_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_user_id',
            fields: ['user_id'],
            references: {
                table: 'users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_rescuer_id',
            fields: ['rescuer_id'],
            references: {
                table: 'users',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('requests', {
            type: 'FOREIGN KEY',
            name: 'FK_requests_request_type_id',
            fields: ['request_type_id'],
            references: {
                table: 'request_types',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('requests', 'FK_requests_userId')
        await queryInterface.removeConstraint('requests', 'FK_requests_request_type_id')
        await queryInterface.dropTable('requests');
    }
};
