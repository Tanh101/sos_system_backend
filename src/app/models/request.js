'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    Request.init({
        id: {
            type: DataTypes.BIGINT(20),
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            foreignKey: true
        },
        rescuerId: {
            type: DataTypes.BIGINT(20),
            allowNull: true,
            foreignKey: true
        },
        requestTypeId: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            foreignKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 500]
            }
        },
        isEmergency:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        voteCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'requests',
    });

    return Request;
};