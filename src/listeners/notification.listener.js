const eventEmitter = require("../utils/eventEmitter");
const NotificationService = require("../services/notificationService/notification.service");

const setupNotificationListener = (io) => {
    if (!eventEmitter.listenerCount("newNotification")) {
        eventEmitter.on("newNotification", async (data) => {
            try {
                const userId = data.userId;
                const notifications = await NotificationService.getNotification(
                    userId
                );
                io.to(`user_${userId}`).emit("notificationList", notifications);
                console.log(`Notification for user ${userId}`);
            } catch (error) {
                console.error("Error in newNotification listener:", error);
            }
        });
    }
};

module.exports = setupNotificationListener;
