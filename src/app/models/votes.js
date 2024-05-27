'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class votes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    votes.init({
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
        requestId: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            foreignKey: true
        },
        voteType: {
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        underscored: true,
        underscoredAll: true,
        modelName: 'votes',
        deletedAt: 'destroyTime',
    });
    return votes;
};
