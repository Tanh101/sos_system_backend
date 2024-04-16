const Sequelize = require("sequelize");
const userModel = require("../app/models/user.model");
require('dotenv').config();

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

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const User = userModel(sequelize, Sequelize);

/**
 * Uncomment this in order to generate table
 */
// sequelize.sync().then(console.log('DB is synced'));

module.exports = { User };
