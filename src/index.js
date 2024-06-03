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
const conversationRoute = require("./routes/conversation.route");
const port = systemConfig.port || 3000;

const clientController = require("./app/controllers/socket/client.controller");
const rescuerController = require("./app/controllers/socket/rescuer.controller");
const locationController = require("./app/controllers/socket/location.controller");
const authMiddleware = require("./middlewares/socket/auth.middleware");
const notificationController = require("./app/controllers/socket/notification.controller");
const statisticRoute = require("./routes/statistic.route");
const conversationController = require("./app/controllers/socket/conversation.controller");

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

//statistic route
app.use('/api/statistic', statisticRoute);

// conversation route
app.use("/api/conversation", conversationRoute);

let rescuers = [];
socketIo.use((socket, next) => {
    authMiddleware.checkAuthHeader(socket, next);
});

socketIo.on("connection", (socket) => {
    console.log(`User ${socket.id} with userId ${socket.user.id} connected`);
    const role = socket.user.role;
    socket.join(role);
    socket.join(socket.user.id);

    // auth middleware
    socket.use((package, next) => {
        authMiddleware.checkAuth(socket, package, (error) => {
            if (error) {
                console.error("Authentication error:", error.message);
                // Emit the error back to the client
                if (error.message === "Unauthorized: Token expired") {
                    socket.emit("tokenExpired", { message: error.message });
                } else {
                    socket.emit("error", { message: error.message });
                }
            } else {
                next();
            }
        });
    });

    locationController(socketIo, socket);
    notificationController(socketIo, socket);
    conversationController(socketIo, socket);
});

socketIo.on("disconnect", (socket) => {
    console.log(`User ${socket.id} with userId ${socket.user.id} disconnected`);
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
