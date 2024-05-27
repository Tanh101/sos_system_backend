"use strict";

const { ENUM } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("votes", {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true,
            },
            request_id: {
                type: Sequelize.BIGINT(20),
                allowNull: false,
                foreignKey: true,
            },
            vote_type: {
                type: Sequelize.INTEGER,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            }
        });

        await queryInterface.addConstraint("votes", {
            type: "FOREIGN KEY",
            name: "fk_request_votes",
            fields: ["request_id"],
            references: {
                table: "requests",
                field: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        await queryInterface.addConstraint("votes", {
            type: "FOREIGN KEY",
            name: "fk_users_votes",
            fields: ["user_id"],
            references: {
                table: "users",
                field: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("votes", "fk_request_id");
        await queryInterface.removeConstraint("votes", "fk_user_id");
        await queryInterface.dropTable("votes");
    },
};
