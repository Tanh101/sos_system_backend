const LocationService = require("../../../services/locationService/location.service");
const NotificationService = require("../../../services/notificationService/notification.service");
const RequestService = require("../../../services/requestService/request.service");

module.exports = (io, socket) => {
    socket.on("startSharingLocation", async (data) => {
        try {
            const { requestId, latitude, longitude } = data;
            const userId = socket.user.id;

            if (!requestId) {
                return socket.emit("error", "Request ID is required");
            }

            const request = await RequestService.getById(requestId);
            console.log("request", request.dataValues.userId);
            console.log("userId", userId);

            // Verify that the Request ID is valid (exists in your SQL database)
            if (!request) {
                return socket.emit("error", "Invalid Request ID");
            }

            // Check if the user is the owner of the request
            if (request.dataValues.userId !== userId) {
                return socket.emit(
                    "error",
                    "You are not the owner of this request"
                );
            }

            await LocationService.update(
                requestId,
                userId,
                latitude,
                longitude
            );

            // Join the room associated with the Request ID
            socket.join(requestId);
            console.log(`User started sharing location in room ${requestId}`);

            // Create a notification for specific users
            const notificationMsg = `User ${userId} is sharing location`;
            await NotificationService.create(userId, notificationMsg);

            return socket.emit("locationSharingStarted", { requestId });
        } catch (error) {
            // ... (handle errors, e.g., invalid Request ID)
        }
    });

    socket.on("joinRequestRoom", async (data) => {
        const requestId = data.requestId;

        console.log("requestId", requestId);

        if (!requestId) {
            return socket.emit("error", "Request ID is required");
        }

        socket.join(requestId);
        console.log(`User joined room ${requestId}`);

        try {
            const latestLocation = await LocationService.find(requestId);
            if (latestLocation) {
                socket.emit("locationUpdate", {
                    requestId,
                    latitude: latestLocation.location.coordinates[1],
                    longitude: latestLocation.location.coordinates[0],
                });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            // Consider sending an error message to the client here
        }
    });

    socket.on("leaveRequestRoom", (data) => {
        const requestId = data.requestId;

        socket.leave(requestId);
        console.log(`User left room ${requestId}`);
    });

    socket.on("updateLocation", async (data) => {
        try {
            const { requestId, latitude, longitude } = data;
            const userId = socket.user.id;

            // Check if the user is the owner of the request
            const location = await LocationService.find(requestId);
            if (location.userId !== userId) {
                return socket.emit(
                    "error",
                    "You are not the owner of this request"
                );
            }

            await LocationService.update(
                requestId,
                userId,
                latitude,
                longitude
            );

            // Broadcast the updated location to others in the same room
            socket
                .to(requestId)
                .emit("locationUpdate", { requestId, latitude, longitude });
            console.log(`Location updated in room ${requestId}`);
        } catch (error) {
            console.error("Error updating location:", error.message);
        }
    });

    socket.on("stopSharingLocation", async (data) => {
        const requestId = data.requestId;
        const request = await RequestService.getById(requestId);

        // Verify that the Request ID is valid (exists in your SQL database)
        if (!request) {
            return socket.emit("error", "Invalid Request ID");
        }

        // Check if the user is the owner of the request
        if (request.dataValues.userId !== userId) {
            return socket.emit(
                "error",
                "You are not the owner of this request"
            );
        }

        socket.leave(requestId);
        console.log(`User stopped sharing location in room ${requestId}`);
        // delete room

        // Potentially, remove the location document from MongoDB if needed
    });
};
