const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const mongoDB = require("./app/configs/mongoose.config");

const app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const systemConfig = require("./app/configs/system.config");
const uploadroute = require("./routes/upload.route");
const requestRoute = require("./routes/request.route");
const requestTypeRoute = require("./routes/requestType.route");
const port = systemConfig.port || 3000;

const clientController = require("./app/controllers/socket/client.controller");
const rescuerController = require("./app/controllers/socket/rescuer.controller");
const locationController = require("./app/controllers/socket/location.controller");

// connect to mongodb
mongoDB.connect();

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

// auth route
app.use("/api/auth", authRoute);

// user route
app.use("/api/user", userRoute);

// upload route
app.use("/api/upload", uploadroute);

//request route
app.use("/api/requests", requestRoute);

//requestType route
app.use("/api/type", requestTypeRoute);

let rescuers = [];
socketIo.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    // Xử lý khi client gửi yêu cầu
    socket.on("clientRequest", (data) => {
        clientController.handleClientRequest(socketIo, socket, data, rescuers);
    });

    // Xử lý khi rescuer kết nối
    socket.on("rescuerJoin", () => {
        rescuerController.handleRescuerJoin(socket, rescuers);
    });

    // Xử lý khi rescuer phản hồi
    socket.on("rescuerResponse", (data) => {
        rescuerController.handleRescuerResponse(
            socketIo,
            socket,
            data,
            clientController
        );
    });

    locationController(socketIo, socket);

    // Xử lý khi ngắt kết nối
    socket.on("disconnect", () => {
        rescuers = rescuerController.handleDisconnect(socket, rescuers);
    });
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
