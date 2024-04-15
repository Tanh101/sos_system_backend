const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require('./app/config/db/index');
const moment = require('moment-timezone');

const http = require('http');
const app = express();
const server = http.Server(app);

const authRouter = require("./routes/auth");


const defaultTimezone = 'Asia/Ho_Chi_Minh';
moment.tz.setDefault(defaultTimezone);

dotenv.config();

// CONNECT TO DB
db.connectMongoDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
// app.use('/api/auth', authRouter);

app.use('', (req, res) => {
  res.send('Hello World');
});

server.listen(8000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
