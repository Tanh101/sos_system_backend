const express = require('express')
const morgan = require('morgan')
require('dotenv').config();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const cors = require("cors");
const http = require('http');

const app = express()
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
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

socketIo.on("connection", (dataSocket) => {
    console.log("New client connected" + dataSocket.id);

    dataSocket.on("sos", function (data) {
        console.log("Client send SOS: " + data.message);
        const serverMessage = "I'm here, don't worry" + dataSocket.id + data.message;
        socketIo.to(dataSocket.id).emit("serverResponse", { serverMessage });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })

    dataSocket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
