const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('request',
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,

            },
            user_id: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
                foreignKey: true
            },
            rescuer_id: {
                type: DataTypes.BIGINT(20),
                allowNull: true,
                foreignKey: true
            },
            request_type_id: {
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
            vote_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            paranoid: true,
            underscored: true,
            defaultScope: {},
            scopes: {}
        }
    )
}
