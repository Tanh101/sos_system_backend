const eventEmitter = require("../utils/eventEmitter");
const NotificationService = require("../services/notificationService/notification.service");

exports.setupNotificationListener = (io) => {
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

exports.setupAcceptRequestListener = (io) => {
    if (!eventEmitter.listenerCount("updateRequest")) {
        eventEmitter.on("updateRequest", async (data) => {
            try {
                const roomName = `requestDetail_${data.request.id}`;
                io.to(roomName).emit("updatedStatus", { status: data.request.status });
            } catch (error) {
                console.error("Error in newNotification listener:", error);
            }
        });
    }
}

exports.setupdVoteListener = (io) => {
    if (!eventEmitter.listenerCount("newVote")) {
        eventEmitter.on("newVote", async (data) => {
            try {
                const userId = data.userId;
                const roomName = `requestDetail_${data.requestId}`;
                io.to(roomName).emit("newVoteUpdate", { voteCount: data.voteCount, voteType: data.voteType });
            } catch (error) {
                console.error("Error in newNotification listener:", error);
            }
        });
    }
}
