const NotificationService = require("../../../services/notificationService/notification.service");
const eventEmitter = require("../../../utils/eventEmitter");

module.exports = (io, socket) => {
    socket.on("getNotification", async (data) => {
        try {
            const userId = socket.user.id;
            const notifications = await NotificationService.getNotification(
                userId
            );

            socket.emit("notificationList", notifications);
            console.log(`user ${userId} got notification`);
        } catch (error) {
            console.error("Error in getNotification:", error);
        }
    });
};
