'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class requestType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    requestType.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        underscored: true,
        underscoredAll: true,
        modelName: 'requestTypes',
    });
    return requestType;
};