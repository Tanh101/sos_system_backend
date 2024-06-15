const UserCountService = require("../../../services/userCountService/userCount.service");

module.exports = (io, socket) => {
    socket.on("getUnviewedCounts", async () => {
        const userId = socket.user.id;

        try {
            const userCount = await UserCountService.get(userId);

            socket.emit("unviewedCountUpdated", userCount);
        } catch (error) {
            return socket.emit("error", "Unable to get unviewed counts");
        }
    });

    socket.on("resetUnviewedNotifications", async () => {
        const userId = socket.user.id;

        try {
            const userCount = await UserCountService.resetUnviewedNotifications(
                userId
            );

            if (userCount) {
                socket.emit("unviewedCountUpdated", userCount);
            }
        } catch (error) {
            return socket.emit("error", "Unable to reset unviewed notifications");
        }
    });

    socket.on("resetUnviewedMessages", async () => {
        const userId = socket.user.id;

        try {
            const userCount = await UserCountService.resetUnviewedMessages(
                userId
            );

            if (userCount) {
                socket.emit("unviewedCountUpdated", userCount);
            }
        } catch (error) {
            return socket.emit("error", "Unable to reset unviewed messages");
        }
    });
};
