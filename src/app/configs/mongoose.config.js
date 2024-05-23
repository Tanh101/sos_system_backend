const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const mongoStr = process.env.MONGO_CONNECTION_STRING;

const connect = async () => {
    try {
        const conn = await mongoose.connect(mongoStr);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connect };
