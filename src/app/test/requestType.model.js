const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('request_type',
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,

            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
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
