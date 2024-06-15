const Conversation = require("../../app/models/mongo/conversation");
const UserCountService = require("../userCountService/userCount.service");
const db = require("../../app/models/index");
const User = db.users;

exports.find = async (conversationId) => {
    try {
        const conversation = await Conversation.findById(conversationId);

        return conversation;
    } catch (error) {
        console.error("Error fetching conversation:", error);
        throw error;
    }
};

exports.getByUserId = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId,
        }).sort({ "lastMessage.timestamp": -1 });

        const opponentIds = new Set();
        conversations.forEach((conversation) => {
            conversation.participants.forEach((participant) => {
                if (participant !== userId) {
                    opponentIds.add(participant);
                }
            });
        });

        const opponents = await User.scope("withoutPhone").findAll({
            where: { id: [...opponentIds] },
        });

        const opponentMap = {};
        opponents.forEach((opponent) => {
            opponentMap[opponent.id] = opponent;
        });

        const formattedConversations = conversations.map((conversation) => {
            const opponentId = conversation.participants.find(
                (participant) => participant !== userId
            );
            const opponent = opponentMap[opponentId];

            return {
                _id: conversation._id,
                lastMessage: conversation.lastMessage,
                unreadCount: conversation.unreadCount.get(userId.toString()),
                opponent,
            };
        });

        return formattedConversations;
    } catch (error) {
        console.error("Error fetching conversation:", error);
        throw error;
    }
};

exports.getMessages = async (senderId, receiverId) => {
    try {
        const opponent = await User.scope("withoutPhone").findByPk(receiverId);

        if (!opponent) {
            return null;
        }

        const participants = [senderId, receiverId].sort();
        const conversation = await Conversation.findOne({ participants });
        if (!conversation) {
            return {
                _id: null,
                opponent,
                messages: [],
            };
        }

        const messages = conversation.messages;

        return {
            _id: conversation._id,
            opponent,
            messages,
        };
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

exports.update = async (senderId, receiverId, message) => {
    try {
        const participants = [senderId, receiverId].sort();
        let conversation = await Conversation.findOne({ participants });

        if (!conversation) {
            conversation = new Conversation({
                participants,
                messages: [],
                // Set unread count for each participant
                unreadCount: participants.reduce(
                    (acc, participant) => ({
                        ...acc,
                        [participant.toString()]: 0,
                    }),
                    {}
                ),
            });
        }

        const newMessage = { sender: senderId, message, timestamp: new Date() };
        conversation.messages.push(newMessage);
        conversation.lastMessage = newMessage;
        const receiverIdStr = receiverId.toString();
        conversation.unreadCount.set(
            receiverIdStr,
            (conversation.unreadCount.get(receiverIdStr) || 0) + 1
        );
        await conversation.save();

        // Increment unviewed messages count for the receiver
        await UserCountService.updateUnviewedMessages(receiverId);

        return conversation;
    } catch (error) {
        console.error("Error updating conversation:", error);
        throw error;
    }
};

exports.markAsRead = async (conversationId, userId) => {
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return null;
        }

        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();

        console.log(`Marked conversation ${conversationId} as read for user ${userId}`);

        return conversation;
    } catch (error) {
        console.error("Error marking conversation as read:", error);
        throw error;
    }
};
