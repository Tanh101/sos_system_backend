const express = require('express')
const morgan = require('morgan')
require('dotenv').config();

const app = express()

app.use(morgan('short'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route');
const systemConfig = require('./app/configs/system.config');

const port = systemConfig.port || 3000

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

// auth route
app.use('/api/auth', authRoute)

// user route
app.use('/api/user', userRoute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
