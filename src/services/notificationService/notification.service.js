const Notification = require("../../app/models/mongo/notification");
const eventEmitter = require("../../utils/eventEmitter");

exports.getNotification = (userId) => {
    return Notification.find({ userId }).sort({ createdAt: -1 });
};

exports.markAsRead = (notificationId) => {
    return Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
    );
};

exports.create = async (userId, message) => {
    const notification = new Notification({
        userId,
        message,
    });
    await notification.save();
    // Emit an event to notify the user to get the latest notifications
    eventEmitter.emit("newNotification", { userId });

    return notification;
};