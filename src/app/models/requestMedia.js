'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class requestMedia extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    requestMedia.init({
        requestId: {
            type: DataTypes.BIGINT(20),
            allowNull: true,
            foreignKey: true
        },
        url: DataTypes.STRING
    }, {
        sequelize,
        underscored: true,
        underscoredAll: true,
        modelName: 'requestMedia',
    });
    return requestMedia;
};