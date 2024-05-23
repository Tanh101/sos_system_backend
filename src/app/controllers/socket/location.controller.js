const LocationService = require("../../../services/locationService/location.service");
const RequestService = require("../../../services/requestService/request.service");

module.exports = (io, socket) => {
    socket.on("startSharingLocation", async (requestId) => {
        try {
            // 1. Verify that the post ID is valid (exists in your SQL database)
            

            // 2. Join the room associated with the post ID
            socket.join(requestId);
            console.log(`User started sharing location in room ${requestId}`);
        } catch (error) {
            // ... (handle errors, e.g., invalid post ID)
        }
    });

    socket.on("joinPostRoom", async (requestId) => {
        socket.join(requestId);
        console.log(`User joined room ${requestId}`);

        try {
            const latestLocation = await LocationService.find(requestId);
            if (latestLocation) {
                // socket.emit("locationUpdate", {
                //     requestId,
                //     latitude: latestLocation.location.coordinates[1],
                //     longitude: latestLocation.location.coordinates[0],
                // });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            // Consider sending an error message to the client here
        }
    });

    socket.on("leavePostRoom", (requestId) => {
        socket.leave(requestId);
        console.log(`User left room ${requestId}`);
    });

    socket.on("updateLocation", (data) => {
        try {
            const { requestId, latitude, longitude } = data;
            LocationService.update(requestId, latitude, longitude);

            // Broadcast the updated location to others in the same room
            socket
                .to(requestId)
                .emit("locationUpdate", { requestId, latitude, longitude });
            console.log(`Location updated in room ${requestId}`);
        } catch (error) {
            console.error("Error updating location:", error.message);
        }
    });

    socket.on("stopSharingLocation", (requestId) => {
        socket.leave(requestId);
        console.log(`User stopped sharing location in room ${requestId}`);
        // Potentially, remove the location document from MongoDB if needed
    });
};
