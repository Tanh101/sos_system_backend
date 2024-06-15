const UserCount = require("../../app/models/mongo/userCount");
const Conversation = require("../../app/models/mongo/conversation");
const eventEmitter = require("../../utils/eventEmitter");

exports.get = async (userId) => {
    try {
        const userCount = await UserCount.findOne({ userId });

        return userCount;
    } catch (error) {
        throw error;
    }
};

exports.updateUnviewedMessages = async (userId) => {
    try {
        const unviewedMessagesCount = await Conversation.countDocuments({
            [`unreadCount.${userId}`]: { $gt: 0 },
        });

        console.log("Unread conversations count:", unviewedMessagesCount);

        // Update the user's unread conversations count
        const userCount = await UserCount.findOneAndUpdate(
            { userId },
            { unviewedMessages: unviewedMessagesCount },
            { new: true, upsert: true }
        );

        eventEmitter.emit("unviewedCountUpdated", { userId });

        return userCount;
    } catch (error) {
        console.error("Error updating unread conversations count:", error);
        throw error;
    }
};

exports.incrementUnviewedNotifications = async (userId) => {
    try {
        const userCount = await UserCount.findOne({ userId });

        if (!userCount) {
            const newUserCount = new UserCount({
                userId,
                unviewedNotifications: 1,
            });

            await newUserCount.save();
            return newUserCount;
        }

        userCount.unviewedNotifications += 1;
        await userCount.save();

        eventEmitter.emit("unviewedCountUpdated", { userId });

        return userCount;
    } catch (error) {
        throw error;
    }
};

exports.incrementUnviewedMessages = async (userId) => {
    try {
        const userCount = await UserCount.findOne({ userId });

        if (!userCount) {
            const newUserCount = new UserCount({
                userId,
                unviewedMessages: 1,
            });

            await newUserCount.save();
            return newUserCount;
        }

        userCount.unviewedMessages += 1;
        await userCount.save();

        eventEmitter.emit("unviewedCountUpdated", { userId });

        return userCount;
    } catch (error) {
        throw error;
    }
};

exports.resetUnviewedNotifications = async (userId) => {
    try {
        const userCount = await UserCount.findOne({ userId });

        if (!userCount) {
            return null;
        }

        userCount.unviewedNotifications = 0;
        await userCount.save();

        eventEmitter.emit("unviewedCountUpdated", { userId });

        return userCount;
    } catch (error) {
        throw error;
    }
};

exports.resetUnviewedMessages = async (userId) => {
    try {
        const userCount = await UserCount.findOne({ userId });

        if (!userCount) {
            return null;
        }

        userCount.unviewedMessages = 0;
        await userCount.save();

        eventEmitter.emit("unviewedCountUpdated", { userId });

        return userCount;
    } catch (error) {
        throw error;
    }
};
