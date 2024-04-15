const mongoose = require('mongoose');
require('dotenv').config();

const mongoString = process.env.MONGO_DB_URL;
const mysqlHost = process.env.MYSQL_DB_HOST;
const mysqlUser = process.env.MYSQL_DB_USERNAME;
const mysqlPassword = process.env.MYSQL_DB_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DB_DATABASE;

mongoose.set("strictQuery", false);

async function connectMongoDB() {
    try {
        await mongoose.connect(mongoString)
        .then(() => console.log('Connected to MongoDB'))
    } catch (error) {
        console.log(error)
    }
}

async function connectMysqlDB() {
    try {
        const mysqlConnection = mysql.createConnection({
            host: mysqlHost,
            user: mysqlUser,
            password: mysqlPassword,
            database: mysqlDatabase,
        });
    
        mysqlConnection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database:', err);
                return null;
            }
            console.log('Connected to MySQL');
        });
    
        return mysqlConnection;
    } catch (error) {
        console.log(error)
    }
}
module.exports = {connectMongoDB, connectMysqlDB}
