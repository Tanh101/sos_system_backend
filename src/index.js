const express = require('express')
const morgan = require('morgan')
require('dotenv').config();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')

const app = express()

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route');
const systemConfig = require('./app/configs/system.config');
const uploadroute = require('./routes/upload.route');
const port = systemConfig.port || 3000

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

// auth route
app.use('/api/auth', authRoute)

// user route
app.use('/api/user', userRoute)

// upload route
app.use('/api/upload', uploadroute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
