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

            const isExitDangerArea = await DangerAreaService.getByRequestId(requestId);
            if (!isExitDangerArea) {
                await DangerAreaService.create(userId, requestId, latitude, longitude, radius, message, address);

                const users = await UserLocationService.getUserNearby(latitude, longitude, radius);

                const notMsg = "Khu vực hiện tại của bạn đang có nguy cơ nguy hiểm. Vui lòng tránh khu vực này";

                if (users.length > 0) {
                    users.forEach((user) => {
                        NotificationService.create(user.userId, notMsg, requestId);
                    });
                }
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
                await DangerAreaService.update(requestId, radius, message);
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
            }
        } catch (error) {
            console.error("Error in deleteWarningArea:", error);
        }
    });
};
