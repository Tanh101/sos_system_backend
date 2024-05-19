require("dotenv").config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            useUTC: false,
        },
        timezone: "+07:00",
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            useUTC: false,
        },
        timezone: "+07:00",
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            useUTC: false,
        },
        timezone: "+07:00",
    },
};
