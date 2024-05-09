const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {

}

module.exports = (sequelize, type) => {
    return sequelize.define('User',
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
