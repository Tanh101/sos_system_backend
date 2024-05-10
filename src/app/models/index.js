'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();
const db = {};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        logging: false,
        dialect: 'mysql'
    },
);

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require('./user')(sequelize, Sequelize);
db.requests = require('./request')(sequelize, Sequelize);
db.requestTypes = require('./requestType')(sequelize, Sequelize);
db.requestMedia = require('./requestMedia')(sequelize, Sequelize);

db.users.hasMany(db.requests, {
    as: 'requests'
});

db.requests.belongsTo(db.users, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'users'
});

db.requests.belongsTo(db.users, {
    foreignKey: 'rescuerId',
    targetKey: 'id',
    as: 'rescuers'
});

db.requests.hasMany(db.requestMedia, {
    as: 'requestMedia'
});

db.requestTypes.hasMany(db.requests, {
    as: 'requests'
});

db.requests.belongsTo(db.requestTypes, {
    foreignKey: 'requestTypeId',
    targetKey: 'id',
    as: 'requestTypes'
});

db.requestMedia.belongsTo(db.requests, {
    foreignKey: 'requestId',
    targetKey: 'id',
    as: 'requests'
});

module.exports = db;
