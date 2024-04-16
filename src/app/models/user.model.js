const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('user',
        {
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
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'user'
            },
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            paranoid: true,
            underscored: true,
            defaultScope: {
                attributes: { exclude: ['password', 'refreshToken'] }
            },
            scopes: {
                withPassword: {
                    attributes: {}
                }
            }
        }
    )
}
