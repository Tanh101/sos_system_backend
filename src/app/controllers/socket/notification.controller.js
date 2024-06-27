const NotificationService = require("../../../services/notificationService/notification.service");
const eventEmitter = require("../../../utils/eventEmitter");
const DangerAreaService = require("../../../services/dangerAreaService/dangerArea.service");
const UserLocationService = require("../../../services/userLocationService/userLocation.service");
const { DANGER_AREA_STATUS } = require("../../../constants/constants");

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

    socket.on("createDangerArea", async (data) => {
        try {
            const userId = socket.user.id;
            const { requestId, latitude, longitude, radius, message, address } = data;

            await DangerAreaService.createOrUpdate(userId, requestId, latitude, longitude, radius, message, address);

            socket.emit("dangerAreaCreated", requestId);
            
            const users = await UserLocationService.getUserNearby(latitude, longitude, radius);
            console.log(users);

            const notMsg = "Khu vực hiện tại của bạn đang có nguy cơ nguy hiểm. Vui lòng tránh khu vực này";

            if (users.length > 0) {
                users.forEach((user) => {
                    NotificationService.create(user.userId, notMsg, requestId);
                });
            }
        } catch (error) {
            console.error("Error in createWarningArea:", error);
        }
    });

    socket.on("updateDangerArea", async (data) => {
        try {
            const { requestId, latitude, longitude, radius, message } = data;
            const isExitDangerArea = await DangerAreaService.getByRequestId(requestId);
            if (isExitDangerArea) {
                const dangerArea = await DangerAreaService.update(requestId, radius, message);

                if (dangerArea) {
                    socket.emit("dangerAreaUpdated", requestId);
                }
                
                const users = await UserLocationService.getUserNearby(latitude, longitude, radius);

                const notMsg = "Khu vực hiện tại của bạn đang có nguy cơ nguy hiểm. Vui lòng tránh khu vực này";

                if (users.length > 0) {
                    users.forEach((user) => {
                        NotificationService.create(user.userId, notMsg, requestId);
                    });
                }
            }
        } catch (error) {
            console.error("Error in updateWarningArea:", error);
        }
    });

    socket.on("deleteDangerArea", async (data) => {
        try {
            const { requestId } = data;
            const status = DANGER_AREA_STATUS.DELETED;
            const isExitDangerArea = await DangerAreaService.getByRequestId(requestId);
            if (isExitDangerArea) {
                await DangerAreaService.updateStatus(requestId, status);
                socket.emit("dangerAreaDeleted", requestId);
            }
        } catch (error) {
            console.error("Error in deleteWarningArea:", error);
        }
    });

    socket.on("reopenDangerArea", async (data) => {
        try {
            const { requestId } = data;
            const status = DANGER_AREA_STATUS.ACTIVE;
            const isExitDangerArea = await DangerAreaService.getByRequestId(requestId);
            if (isExitDangerArea) {
                await DangerAreaService.updateStatus(requestId, status);
                socket.emit("dangerAreaReopened", requestId);
            }
        } catch (error) {
            console.error("Error in reopenWarningArea:", error);
        }
    });

    socket.on("markAsReadNotification", async (data) => {
        try {
            const { id } = data;
            await NotificationService.markAsRead(id);
        } catch (error) {
            console.error("Error in markAsReadNotification:", error);
        }
    });
};
