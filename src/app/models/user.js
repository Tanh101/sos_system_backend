'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            
        }
    }

    User.init({
        id: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [10, 12]
            }
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'users',
        paranoid: true,
        underscored: false,
        defaultScope: {
            attributes: { exclude: ['password', 'refreshToken'] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    });

    return User;
};
